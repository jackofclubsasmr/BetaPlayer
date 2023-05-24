document.addEventListener('DOMContentLoaded', () => {
  const videoPlayer = document.getElementById('video-player');
  const videoSlider = document.getElementById('video-slider');
  const overlay = document.getElementById('overlay');
  const flashingText = document.getElementById('flashing-text');

  const videoSources = [
    'original.mov',
    'minimally_edited.mov',
    'moderately_edited.mov',
    'heavily_edited.mov'
  ];

  let currentTime = 0;
  let flashingInterval;

  videoSlider.addEventListener('input', () => {
    const selectedVersion = videoSlider.value;
    videoPlayer.src = videoSources[selectedVersion];
    videoPlayer.currentTime = currentTime;
    videoPlayer.play();
  });

  videoPlayer.addEventListener('pause', () => {
    currentTime = videoPlayer.currentTime;
  });

  videoPlayer.addEventListener('ended', () => {
    currentTime = 0;
    const selectedVersion = (videoSlider.value + 1) % videoSources.length;
    videoPlayer.src = videoSources[selectedVersion];
    videoPlayer.currentTime = currentTime;
    videoPlayer.play();
  });

  videoPlayer.addEventListener('timeupdate', () => {
    currentTime = videoPlayer.currentTime;
  });

  function updateOverlayText() {
    fetch('captions.txt')
      .then(response => response.text())
      .then(data => {
        const captions = data.split('\n').filter(Boolean);
        const randomIndex = Math.floor(Math.random() * captions.length);
        flashingText.textContent = captions[randomIndex];
      })
      .catch(error => {
        console.error('Error fetching captions:', error);
      });
  }

  function startFlashingText() {
    updateOverlayText();
    overlay.classList.add('show-overlay');
  }

  function stopFlashingText() {
    overlay.classList.remove('show-overlay');
  }

  function scheduleFlashingText() {
    flashingInterval = setInterval(() => {
      startFlashingText();
      setTimeout(stopFlashingText, 500); // Display text for 500 milliseconds
    }, 1500); // Interval of 1500 milliseconds
  }

  function stopScheduledFlashingText() {
    clearInterval(flashingInterval);
    stopFlashingText();
  }

  function handleKeyDown(event) {
    if (event.code === 'ArrowLeft') {
      videoSlider.value = parseInt(videoSlider.value) - 1;
    } else if (event.code === 'ArrowRight') {
      videoSlider.value = parseInt(videoSlider.value) + 1;
    }

    const selectedVersion = videoSlider.value;
    videoPlayer.src = videoSources[selectedVersion];
    videoPlayer.currentTime = currentTime;
    videoPlayer.play();
  }

  startFlashingText();
  scheduleFlashingText();

  videoPlayer.src = videoSources[0];

  document.addEventListener('keydown', handleKeyDown);
});
