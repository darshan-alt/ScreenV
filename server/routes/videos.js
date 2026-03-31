const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  // Approximate 500MB limit
  limits: { fileSize: 500 * 1024 * 1024 } 
});

// Helper function to delete file
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Failed to delete file:', err);
    }
  }
};

// All routes require authentication
router.use(authenticateToken);

// GET /api/videos - List user's videos
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM videos WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ videos: result.rows });
  } catch (error) {
    console.error('Fetch videos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/videos/upload - Upload a new video
// Accepts form-data with 'video' file and 'title', 'duration' fields
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const { title, duration } = req.body;
    const filename = req.file.filename;
    const size = req.file.size;
    
    // Default title if not provided
    const videoTitle = title || `Recording ${new Date().toLocaleString()}`;
    const videoDuration = duration ? parseInt(duration) : 0;

    const result = await db.query(
      `INSERT INTO videos (user_id, title, filename, duration, size) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, videoTitle, filename, videoDuration, size]
    );

    res.status(201).json({ video: result.rows[0] });
  } catch (error) {
    console.error('Upload error:', error);
    // Cleanup partially uploaded file if DB insert fails
    if (req.file) deleteFile(req.file.filename);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/videos/:id - Get video metadata
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM videos WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ video: result.rows[0] });
  } catch (error) {
    console.error('Fetch video info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/videos/:id/stream - Stream the actual video file
router.get('/:id/stream', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT filename FROM videos WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('Video not found');
    }
    
    const filename = result.rows[0].filename;
    const videoPath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send('Video file missing from system');
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Stream video with support for range requests (important for seeking)
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': filename.endsWith('.mp4') ? 'video/mp4' : 'video/webm',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': filename.endsWith('.mp4') ? 'video/mp4' : 'video/webm',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Stream video error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/videos/:id - Update video metadata
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await db.query(
      'UPDATE videos SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
      [title, req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ video: result.rows[0] });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/videos/:id - Delete a video and its file
router.delete('/:id', async (req, res) => {
  try {
    // Get filename first
    const selectResult = await db.query(
      'SELECT filename FROM videos WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (selectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const filename = selectResult.rows[0].filename;

    // Delete from DB
    await db.query(
      'DELETE FROM videos WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    // Delete physical file
    deleteFile(filename);
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/videos/:id/replace - Replace video file (used after editing)
router.post('/:id/replace', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No new video file provided' });
    }

    // Check if video exists and belongs to user
    const checkResult = await db.query(
      'SELECT filename FROM videos WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      deleteFile(req.file.filename);
      return res.status(404).json({ error: 'Video not found' });
    }

    const oldFilename = checkResult.rows[0].filename;
    const newFilename = req.file.filename;
    const newSize = req.file.size;
    
    // Update DB record
    const result = await db.query(
      'UPDATE videos SET filename = $1, size = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [newFilename, newSize, req.params.id]
    );
    
    // Delete old file
    deleteFile(oldFilename);
    
    res.json({ video: result.rows[0] });
  } catch (error) {
    console.error('Replace video error:', error);
    if (req.file) deleteFile(req.file.filename);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
