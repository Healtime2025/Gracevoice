// wakeLock.js

let wakeLock = null;

// Request Wake Lock to Keep Screen On
async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log("🔋 Wake Lock activated");
      wakeLock.addEventListener('release', () => {
        console.log("🔋 Wake Lock released");
      });
    } catch (err) {
      console.error(`🔋 Wake Lock error: ${err.name}, ${err.message}`);
    }
  } else {
    console.log("🔋 Wake Lock API not supported in this browser");
  }
}

// Release Wake Lock
function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
    console.log("🔋 Wake Lock released manually");
  }
}

// Read Selected Verses with Wake Lock
function readSelected() {
  requestWakeLock();
  const book = document.getElementById("bookSelect").value;
  const chapter = document.getElementById("chapterInput").value;
  const startVerse = parseInt(document.getElementById("startVerseInput").value);
  const endVerse = parseInt(document.getElementById("endVerseInput").value);

  if (!book || !chapter) return alert("Please select book and chapter");

  const url = `/api/fetch-script.js?book=${book}&chapter=${chapter}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      let spoken = [];

      if (!startVerse && !endVerse) {
        Object.keys(data.verses).forEach(key => {
          spoken.push(data.verses[key]);
        });
      } else {
        for (let i = startVerse; i <= (endVerse || startVerse); i++) {
          if (data.verses[i]) {
            spoken.push(data.verses[i]);
          }
        }
      }

      window.graceQueue = spoken;
      currentIndex = 0;
      isPaused = false;
      readTextQueue();
    })
    .catch(err => {
      display.innerText = "⚠️ Error loading verses.";
      releaseWakeLock();
    });
}

// Stop Reading and Release Wake Lock
function stopSpeech() {
  speechSynthesis.cancel();
  releaseWakeLock();
}
