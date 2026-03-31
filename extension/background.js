/**
 * ScreenV1 Recorder Service Worker
 * Manages offscreen document for recording logic
 */

let recording = false;

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_RECORDING') {
    startRecording(message.options);
  } else if (message.type === 'STOP_RECORDING') {
    stopRecording();
  } else if (message.type === 'GET_RECORDING_STATUS') {
    sendResponse({ recording });
  }
});

async function startRecording(options) {
  if (recording) return;

  // Create offscreen document if it doesn't exist
  if (!(await chrome.offscreen.hasDocument())) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['DISPLAY_MEDIA', 'USER_MEDIA'],
      justification: 'Record screen and webcam with MediaRecorder'
    });
  }

  // Send start message to offscreen
  chrome.runtime.sendMessage({
    type: 'START_RECORDING_OFFSCREEN',
    options,
    target: 'offscreen'
  });

  recording = true;
  chrome.action.setIcon({ path: 'icons/icon_recording.png' }).catch(() => {});
}

async function stopRecording() {
  if (!recording) return;

  // Send stop message to offscreen
  chrome.runtime.sendMessage({
    type: 'STOP_RECORDING_OFFSCREEN',
    target: 'offscreen'
  });

  recording = false;
  chrome.action.setIcon({ path: 'icons/icon128.png' }).catch(() => {});
}
