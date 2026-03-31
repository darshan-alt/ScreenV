/**
 * ScreenV1 Recorder Offscreen Script
 * Handles the actual recording process with MediaRecorder
 */

let mediaRecorder;
let stream;
let recordedChunks = [];

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target !== 'offscreen') return;

  if (message.type === 'START_RECORDING_OFFSCREEN') {
    startRecording(message.options);
  } else if (message.type === 'STOP_RECORDING_OFFSCREEN') {
    stopRecording();
  }
});

let canvasInterval;
let recordingTimeout;

async function startRecording(options) {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
      audio: true
    });

    let finalStream = screenStream;

    if (options.webcam) {
      const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      const screenVideo = document.createElement('video');
      screenVideo.srcObject = screenStream;
      screenVideo.play();

      const webcamVideo = document.createElement('video');
      webcamVideo.srcObject = webcamStream;
      webcamVideo.play();

      canvasInterval = setInterval(() => {
        ctx.drawImage(screenVideo, 0, 0, 1920, 1080);
        const pipWidth = 320, pipHeight = 240, margin = 20;
        ctx.save();
        ctx.beginPath();
        ctx.arc(1920 - margin - pipWidth/2, 1080 - margin - pipHeight/2, pipHeight/2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(webcamVideo, 1920 - margin - pipWidth, 1080 - margin - pipHeight, pipWidth, pipHeight);
        ctx.restore();
      }, 1000 / 30);

      const canvasStream = canvas.captureStream(30);
      screenStream.getAudioTracks().forEach(t => canvasStream.addTrack(t));
      
      // Store original streams to stop their tracks later
      canvasStream.originalStreams = [screenStream, webcamStream];
      finalStream = canvasStream;
    }

    stream = finalStream;
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      saveRecording();
      if (canvasInterval) clearInterval(canvasInterval);
      if (recordingTimeout) clearTimeout(recordingTimeout);
      
      // Stop all tracks
      if (stream.originalStreams) {
        stream.originalStreams.forEach(s => s.getTracks().forEach(t => t.stop()));
      } else {
        stream.getTracks().forEach(t => t.stop());
      }
    };

    mediaRecorder.start();

    // 6-minute (360s) auto-stop
    recordingTimeout = setTimeout(() => {
      stopRecording();
    }, 360 * 1000);

  } catch (error) {
    console.error('Error starting recording:', error);
    chrome.runtime.sendMessage({ type: 'RECORDING_ERROR', error: error.message });
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

async function saveRecording() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const formData = new FormData();
  formData.append('video', blob, `recording-${Date.now()}.webm`);
  formData.append('title', `Screen Recording ${new Date().toLocaleString()}`);
  
  // Get auth token from storage
  const { token } = await chrome.storage.local.get(['token']);
  
  if (!token) {
    console.error('No auth token found, cannot upload');
    chrome.runtime.sendMessage({ type: 'UPLOAD_ERROR', error: 'Not logged in' });
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/api/videos/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      chrome.runtime.sendMessage({ type: 'UPLOAD_SUCCESS', video: data.video });
      
      // Open dashboard after success
      chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }
  } catch (err) {
    console.error('Upload error:', err);
    chrome.runtime.sendMessage({ type: 'UPLOAD_ERROR', error: err.message });
  } finally {
    recordedChunks = [];
  }
}
