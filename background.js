const sounds = {
    tabNew: new Audio("tabNew.wav"),
    tabClose: new Audio("tabClose.wav"),
    tabUpdate: new Audio("tabUpdate.wav"),
    tabSwitch: new Audio("tabSwitch.wav")
};

// Check if the user selected a custom sound, use default if not.
const setSound = (sound) => {
    if (localStorage.getItem(sound)) {
        return new Audio(localStorage.getItem(sound));
    }
    return sounds[sound];
};

// Check the volume and if the sound is enabled, then play it.
const playSound = (sound, name) => {
    storage.sync.get("globalVolume", (result) => {
        if (result.globalVolume) {
            sound.volume = result.globalVolume;
        }
    });
    storage.sync.get(`${name}Enabled`, (result) => {
        if (result[name + "Enabled"]) {
            sound.play();
        }
    });
};

const { storage, tabs } = chrome;

tabs.onActivated.addListener(() => {
    sounds.tabSwitch = setSound("tabSwitch");
    playSound(sounds.tabSwitch, "tabSwitch");
});

tabs.onUpdated.addListener(() => {
    sounds.tabUpdate = setSound("tabUpdate");
    playSound(sounds.tabUpdate, "tabUpdate");
});

tabs.onCreated.addListener(() => {
    sounds.tabNew = setSound("tabNew");
    playSound(sounds.tabNew, "tabNew");
});

tabs.onRemoved.addListener(() => {
    sounds.tabClose = setSound("tabClose");
    playSound(sounds.tabClose, "tabClose");
});
