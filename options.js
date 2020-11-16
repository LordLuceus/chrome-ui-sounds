const { storage } = chrome;

const settingsSync = {};

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
            }
        });
    });
};

const populateOptionsArray = (optionGroup) => {
    return [
        optionGroup.querySelector(".toggle"),
        optionGroup.querySelector(".volume"),
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
    const saveConfirm = document.querySelector("#save-confirm");
    saveConfirm.style.display = "block";
    saveConfirm.textContent = "Options saved.";
});

document.querySelector("#reset").addEventListener("click", () => {
    storage.sync.clear();
    volumeSliders = document.querySelectorAll("input[type='range']");
    volumeSliders.forEach((element) => {
        element.value = element.dataset.default;
    });
    toggles = document.querySelectorAll("input[type='checkbox']");
    toggles.forEach((element) => {
        element.checked = true;
    });
    const resetConfirm = document.querySelector("#reset-confirm");
    resetConfirm.style.display = "block";
    resetConfirm.textContent = "Options reset.";
});
