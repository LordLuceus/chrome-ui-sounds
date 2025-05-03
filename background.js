const { storage, tabs, offscreen, runtime } = chrome;

const settings = {};
storage.sync.get(null, (result) => {
    Object.assign(settings, result);
});

storage.sync.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
        settings[key] = newValue;
    }
});

async function ensureOffscreen() {
    try {
        if (!(await offscreen.hasDocument())) {
            await offscreen.createDocument({
                url: chrome.runtime.getURL('offscreen.html'),
                reasons: ['AUDIO_PLAYBACK'],
                justification: 'Play audio for UI sounds',
            });
        }
    } catch (err) {
        // Ignore duplicate creation error
        if (!err.message.includes('Only a single offscreen document may be created')) {
            throw err;
        }
    }
}

async function playEvent(soundKey) {
    const enabled = settings[soundKey + 'Enabled'];
    if (enabled === false) {
        return;
    }
    const globalVol = parseFloat(settings.globalVolume ?? 1);
    const specificVol = parseFloat(settings[soundKey + 'Volume'] ?? 1);
    const volume = globalVol * specificVol;
    const pack = settings.soundpack || 'default';
    const url = chrome.runtime.getURL(`sounds/${pack}/${soundKey}.wav`);

    await ensureOffscreen();
    try {
        await runtime.sendMessage({ type: 'play', url, volume });
    } catch (err) {
        // Offscreen listener may not be ready yet; ignore
    }
}

tabs.onActivated.addListener(() => playEvent('tabSwitch'));
tabs.onUpdated.addListener(() => playEvent('tabUpdate'));
tabs.onCreated.addListener(() => playEvent('tabNew'));
tabs.onRemoved.addListener(() => playEvent('tabClose'));

// Close offscreen on request from offscreen page
// Close offscreen on request from offscreen page
runtime.onMessage.addListener((message) => {
    if (message?.type === 'closeOffscreen') {
        offscreen.closeDocument().catch((err) => {
            // Ignore if no document to close
            if (!err.message.includes('No current offscreen document')) {
                console.error('Error closing offscreen document:', err);
            }
        });
    }
});
