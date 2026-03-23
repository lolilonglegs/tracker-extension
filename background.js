console.log("Background script started - always monitoring tabs!");

let currentTabInfo = {
  title: "None",
  url: "None"
};

let currentPlayState = false
let currentVideoValid = false
let currentWatchTime = 0

let tabInterval = null

function updateCurrentTabInfo() {
  chrome.tabs.query({ active: true, frozen: false, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0) {
      const currentTab = tabs[0];

      currentTabInfo.title = currentTab.title;
      currentTabInfo.url = currentTab.url;

      chrome.storage.local.set({ currentTabInfo: currentTabInfo });
    }
  });
}

function updateCurrentWatchtime() {
  if (currentPlayState && (currentTabInfo.url.includes("watch?")) && currentVideoValid) {
    currentWatchTime++;
    console.log("is increasing watchtime: true")

    chrome.storage.local.set({currentWatchTime: currentWatchTime})
  } else {
    console.log("is increasing watchtime: false")
  }
}

function mainUpdate() {
  updateCurrentTabInfo();
  updateCurrentWatchtime();
}


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'PLAY_STATE') {
    currentPlayState = message.videoPlaying;
    currentVideoValid = message.videoValid;

    console.log("is playing: " + currentPlayState)
    console.log("is japanese: " + currentVideoValid)

    chrome.storage.local.set(
      { currentPlayState: currentPlayState,
       currentVideoValid: currentVideoValid }
    )
  }
});



// create loop so its constantly updating
chrome.alarms.create("tabUpdate", {
  periodInMinutes: 1,
  delayInMinutes: 0
});

// make sure when it starts it updates immediately
mainUpdate();
tabInterval = setInterval(mainUpdate, 1000);

// loop
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "tabUpdate") {
    if (tabInterval) {
      clearInterval(tabInterval);
    }
    tabInterval = setInterval(mainUpdate, 1000);
  }
});

// updates when tab changes
chrome.tabs.onActivated.addListener(function (activeInfo) {
  updateCurrentTabInfo();
});