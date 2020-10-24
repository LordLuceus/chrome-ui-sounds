const { storage } = chrome;

const settingsSync = {};
const settingsLocal = {};

const globalVolumeElement = document.querySelector("#globalVolume");
storage.sync.get("globalVolume", (result) => {
    if (result.globalVolume) {
        globalVolumeElement.value = result.globalVolume * 100;
    }
});
globalVolumeElement.addEventListener("change", (event) => {
    settingsSync.globalVolume = parseFloat(event.target.value) / 100;
});

// This function takes an array of elements, iterates over them, and saves each option to a property in the settings object for later storage. We need to do this intermediate step in order to avoid running up against chrome.storage limitations.
const saveOptions = (options) => {
    options.forEach((element, index) => {
        // Make sure the UI reflects the state.
        if (index === 0) {
            storage.sync.get(`${element.parentElement.id}Enabled`, (result) => {
                if (!result[element.parentElement.id + "Enabled"]) {
                    if (
                        result[element.parentElement.id + "Enabled"] ===
                        undefined
                    ) {
                        // We haven't put anything in storage, so do nothing.
                    } else {
                        element.checked = false;
                    }
                }
            });
        } else if (index === 1) {
            storage.sync.get(`${element.parentElement.id}Volume`, (result) => {
                if (result[element.parentElement.id + "Volume"]) {
                    element.value =
                        result[element.parentElement.id + "Volume"] * 100;
                }
            });
        }
        element.addEventListener("change", (event) => {
            if (index === 0) {
                settingsSync[element.parentElement.id + "Enabled"] =
                    event.target.checked;
            } else if (index === 1) {
                settingsSync[element.parentElement.id + "Volume"] =
                    parseFloat(event.target.value) / 100;
            } else if (index === 2) {
                settingsLocal[element.parentElement.id] = URL.createObjectURL(
                    element.files[0]
                );
            }
        });
    });
};

const populateOptionsArray = (optionGroup) => {
    return [
        optionGroup.querySelector(".toggle"),
        optionGroup.querySelector(".volume"),
        optionGroup.querySelector(".custom")
    ];
};

const executeOptions = (optionGroup) => {
    const options = populateOptionsArray(optionGroup);
    saveOptions(options);
};

executeOptions(document.querySelector("#tabUpdate"));
executeOptions(document.querySelector("#tabSwitch"));
executeOptions(document.querySelector("#tabNew"));
executeOptions(document.querySelector("#tabClose"));

document.querySelector("#save").addEventListener("click", () => {
    storage.sync.set({ ...settingsSync });
    storage.local.set({ ...settingsLocal });
});

document.querySelector("#reset").addEventListener("click", () => {
    storage.sync.clear();
    storage.local.clear();
    volumeSliders = document.querySelectorAll("input[type='range']");
    volumeSliders.forEach((element) => {
        element.value = element.dataset.default;
        console.log(element.value);
    });
    toggles = document.querySelectorAll("input[type='checkbox']");
    toggles.forEach((element) => {
        element.checked = true;
    });
    const customInputs = document.querySelectorAll("input[type='file']");
    customInputs.forEach((element) => {
        element.value = "";
    });
});
