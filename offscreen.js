chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'play') {
    const audio = new Audio(message.url);
    audio.volume = message.volume;
    audio
      .play()
      .then(() => {
        audio.addEventListener('ended', () => {
          // Notify service worker to close the offscreen document
          chrome.runtime.sendMessage({ type: 'closeOffscreen' });
        });
      })
      .catch((err) => {
        console.error('Audio playback failed:', err);
      });
  }
});