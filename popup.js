console.log("This is a popup!")


function getCurrentTabInfo() {

    chrome.storage.local.get(['currentPlayState'], function(result) {
        const state = result.currentPlayState;
        document.getElementById('video-playing').textContent = state;
    });

    chrome.storage.local.get(['currentVideoValid'], function(result) {
        const videoValid = result.currentVideoValid;
        document.getElementById('is-japanese').textContent = videoValid;
    });

    chrome.storage.local.get(['currentWatchTime'], function(result) {
        const watchTime = result.currentWatchTime
        if (watchTime <= 60){ // if its in seconds
            document.getElementById("watch-time").textContent = watchTime + " seconds";
        } else if (watchTime <= 3600) { // if its in minutes
            document.getElementById("watch-time").textContent = Math.floor(watchTime / 60) + " minutes " + watchTime % 60 + " seconds";
        } else { // if its in hours
            document.getElementById("watch-time").textContent = Math.floor(watchTime / 3600) + " hours " + Math.floor(watchTime / 60) % 60 + " minutes " + watchTime % 60 + " seconds";
        }
        
    });
};


getCurrentTabInfo();
updateInterval = setInterval(getCurrentTabInfo, 1000);