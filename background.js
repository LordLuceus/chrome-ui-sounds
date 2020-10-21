// These variables will store our Audio objects.
let tabUpdate;
let tabSwitch;
let tabNew;
let tabClose;

// Check if the user selected a custom sound, use default if not.
const getSound = (sound) => {
    if (localStorage.getItem(sound)) {
        return new Audio(localStorage.getItem(sound));
    }
    return new Audio(`${sound}.wav`);
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
    tabSwitch = getSound("tabSwitch");
    playSound(tabSwitch);
});

tabs.onUpdated.addListener(() => {
    tabUpdate = getSound("tabUpdate");
    playSound(tabUpdate);
});

tabs.onCreated.addListener(() => {
    tabNew = getSound("tabNew");
    playSound(tabNew);
});

tabs.onRemoved.addListener(() => {
    tabClose = getSound("tabClose");
    playSound(tabClose);
});
