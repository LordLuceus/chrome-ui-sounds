const { storage } = chrome;

// This function takes an array of elements, iterates over them, and saves each option to Chrome storage appropriately
const saveOptions = (options) => {
    options.forEach((element, index) => {
        if (index === 0) {
            storage.sync.get(`${element.parentElement.id}Enabled`, (result) => {
                if (!result[element.parentElement.id + "Enabled"]) {
                    element.checked = false;
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

const getOptions = (optionGroup) => {
    const options = [
        optionGroup.querySelector(".toggle"),
        optionGroup.querySelector(".volume"),
        optionGroup.querySelector(".custom")
    ];
    saveOptions(options);
};

getOptions(document.querySelector("#tabUpdate"));

// storage.sync.get(null, (result) => {
//     console.log(result);
// });
