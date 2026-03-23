console.log("content script started")

const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;

function isVideoPlaying() {
    const video = document.querySelector("video")
    console.log(video)

    if (!video) {
        console.log("didnt find video")
        return false;
    }

    console.log(video.ended)
    console.log(video.paused)

    
    return !video.ended && !video.paused
}

function detectJapaneseContent() {
    const title = document.querySelector("title").text;
    const description = document.querySelector("meta[name='description']").content;
    const keywords = document.querySelector("meta[name='keywords']").content;

    if (japaneseRegex.test(title) || japaneseRegex.test(description) || japaneseRegex.test(keywords)) {
        return true;
    }
    
    return false;
}



function sendPlayState() {
    const videoPlaying = isVideoPlaying();
    const videoValid = detectJapaneseContent();

    chrome.runtime.sendMessage({
        type: 'PLAY_STATE',
        videoPlaying: videoPlaying,
        videoValid: videoValid
      });

    return videoPlaying;
}

sendPlayState();
setInterval(sendPlayState, 1000);
