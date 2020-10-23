const { storage } = chrome;

// This function takes an array of elements, iterates over them, and saves each option to Chrome storage appropriately
const saveOptions = (options) => {
    options.forEach((element, index) => {
        // Make sure the UI follows the state.
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
        }
        element.addEventListener("input", (event) => {
            if (index === 0) {
                storage.sync.set({
                    [element.parentElement.id + "Enabled"]: event.target.checked
                });
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
