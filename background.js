const { storage, tabs } = chrome;

const settings = {};
storage.sync.get(null, (result) => {
    settings.sync = { ...result };
});

storage.sync.onChanged.addListener((changes) => {
    storage.sync.get(null, (result) => {
        if (!result) {
            settings.sync = {};
        }
    });
    for (let key in changes) {
        const storageChange = changes[key];
        settings.sync[key] = storageChange.newValue;
    }
});

const setSound = (sound, func) => {
    func(
        new Audio(`sounds/${settings.sync.soundpack || "default"}/${sound}.wav`)
    );
};

const sounds = {};

// Check the volume and if the sound is enabled, then play it.
const playSound = (sound, name) => {
    if (settings.sync.globalVolume && settings.sync[name + "Volume"]) {
        sound.volume =
            parseFloat(settings.sync.globalVolume) *
            parseFloat(settings.sync[name + "Volume"]);
    } else if (settings.sync.globalVolume) {
        sound.volume = parseFloat(settings.sync.globalVolume);
    } else if (settings.sync[name + "Volume"]) {
        sound.volume = parseFloat(settings.sync[name + "Volume"]);
    }
    if (
        settings.sync[name + "Enabled"] ||
        settings.sync[name + "Enabled"] === undefined
    ) {
        sound.play();
    }
};

tabs.onActivated.addListener(() => {
    setSound("tabSwitch", (value) => {
        sounds.tabSwitch = value;
    });
    playSound(sounds.tabSwitch, "tabSwitch");
});

tabs.onUpdated.addListener(() => {
    setSound("tabUpdate", (value) => {
        sounds.tabUpdate = value;
    });
    playSound(sounds.tabUpdate, "tabUpdate");
});

tabs.onCreated.addListener(() => {
    setSound("tabNew", (value) => {
        sounds.tabNew = value;
    });
    playSound(sounds.tabNew, "tabNew");
});

tabs.onRemoved.addListener(() => {
    setSound("tabClose", (value) => {
        sounds.tabClose = value;
    });
    playSound(sounds.tabClose, "tabClose");
});
