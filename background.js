const { storage, tabs } = chrome;

const sounds = {
    tabNew: null,
    tabClose: null,
    tabUpdate: null,
    tabSwitch: null
};

// Check if the user selected a custom sound, use default if not.
const setSound = (sound, func) => {
    storage.local.get(sound, (result) => {
        if (result[sound]) {
            func(new Audio(result[sound]));
        } else {
            func(new Audio(`${sound}.wav`));
        }
    });
};

// Check the volume and if the sound is enabled, then play it.
const playSound = (sound, name) => {
    storage.sync.get(
        ["globalVolume", `${name}Enabled`, `${name}Volume`],
        (result) => {
            if (result.globalVolume) {
                sound.volume = parseFloat(result.globalVolume);
            } else if (result.globalVolume && result[name + "Volume"]) {
                sound.volume =
                    parseFloat(result.globalVolume) *
                    parseFloat(result[name + "Volume"]);
            }
            if (result[name + "Enabled"]) {
                sound.play();
            }
        }
    );
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
