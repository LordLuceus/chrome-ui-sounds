const tabUpdate = new Audio("tab_update.wav");
const tabSwitch = new Audio("switch.wav");
const newTab = new Audio("new_tab.wav");

chrome.tabs.onUpdated.addListener(() => {
    tabUpdate.play();
});

chrome.tabs.onActivated.addListener(() => {
    tabSwitch.play();
});

chrome.tabs.onCreated.addListener(() => {
    newTab.play();
});
