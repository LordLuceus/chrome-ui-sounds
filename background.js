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

// Play the sound
const playSound = (sound) => {
    if (localStorage.getItem("volume")) {
        sound.volume = localStorage.getItem("volume");
    }
    sound.play();
};

const { storage, tabs } = chrome;

tabs.onActivated.addListener(() => {
    sounds.tabSwitch = setSound("tabSwitch");
    playSound(sounds.tabSwitch);
});

tabs.onUpdated.addListener(() => {
    sounds.tabUpdate = setSound("tabUpdate");
    playSound(sounds.tabUpdate);
});

tabs.onCreated.addListener(() => {
    sounds.tabNew = setSound("tabNew");
    playSound(sounds.tabNew);
});

tabs.onRemoved.addListener(() => {
    sounds.tabClose = setSound("tabClose");
    playSound(sounds.tabClose);
});
