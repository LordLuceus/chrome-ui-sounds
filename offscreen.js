// Audio pool per URL to support overlapping playback
const audioPools = {};
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "play") {
    const { url, volume } = message;
    let pool = audioPools[url];
    if (!pool) {
      pool = [];
      audioPools[url] = pool;
    }
    // Get a free player (not currently playing)
    let player = pool.find((a) => !a.busy);
    if (!player) {
      player = new Audio(url);
      player.preload = "auto";
      player.busy = false;
      player.addEventListener("ended", () => {
        player.busy = false;
      });
      pool.push(player);
    }
    // Play from start
    player.busy = true;
    player.volume = volume;
    try {
      player.currentTime = 0;
    } catch (e) {
      console.warn("Could not reset audio position:", e);
    }
    player.play().catch((err) => {
      console.error("Audio playback failed:", err);
      player.busy = false;
    });
  }
});
