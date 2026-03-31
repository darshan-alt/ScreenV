document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('login-form');
  const controls = document.getElementById('controls');
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const webcamToggle = document.getElementById('webcam-toggle');
  const statusIndicator = document.querySelector('.status-indicator .text');
  const indicator = document.querySelector('.indicator');

  // Check login status (TBD: connect to production API)
  const token = (await chrome.storage.local.get(['token'])).token;
  if (!token) {
    loginForm.classList.remove('hidden');
    controls.classList.add('hidden');
  }

  // Initial status
  chrome.runtime.sendMessage({ type: 'GET_RECORDING_STATUS' }, (response) => {
    if (response?.recording) {
      updateUI(true);
    }
  });

  startBtn.addEventListener('click', () => {
    const webcam = webcamToggle.checked;
    chrome.runtime.sendMessage({ 
      type: 'START_RECORDING', 
      options: { webcam } 
    });
    updateUI(true);
  });

  stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'STOP_RECORDING' });
    updateUI(false);
  });

  function updateUI(isRecording) {
    if (isRecording) {
      startBtn.classList.add('hidden');
      stopBtn.classList.remove('hidden');
      statusIndicator.textContent = 'Recording...';
      indicator.style.background = '#ef4444';
      indicator.style.boxShadow = '0 0 8px #ef4444';
      indicator.classList.add('pulse');
    } else {
      startBtn.classList.remove('hidden');
      stopBtn.classList.add('hidden');
      statusIndicator.textContent = 'Ready';
      indicator.style.background = '#22c55e';
      indicator.style.boxShadow = 'none';
      indicator.classList.remove('pulse');
    }
  }
});
