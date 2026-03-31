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

async function startRecording(options) {
  try {
    // Get screen stream
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
      },
      audio: true
    });

    // Get webcam if needed
    if (options.webcam) {
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      // Composite screen and webcam here (TBD: advanced compositing logic)
      // For now, let's just record the screen
    }

    stream = screenStream;
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp9'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      saveRecording();
      // Clean up
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
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
      // chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
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
