// GraceVoice Voice Command Handler + Scripture Fetcher

const SCRIPT_API = "https://script.google.com/macros/s/AKfycbzntpRTmAaDZSP3LJn1X-3nsJeyAr6AMPGg41Du9_Hnh0XFsNwI0o2O6hUVEzEFeT529Q/exec";

function parseVoiceCommand(command) {
  command = command.toLowerCase();

  const matchSingle = command.match(/read\s+(\w+)\s+(\d+)\s+verse\s+(\d+)/);
  if (matchSingle) {
    return {
      action: "read",
      book: matchSingle[1],
      chapter: matchSingle[2],
      verses: [matchSingle[3]]
    };
  }

  const matchRange = command.match(/read\s+(\w+)\s+(\d+)\s+verses\s+(\d+)\s+to\s+(\d+)/);
  if (matchRange) {
    const verses = [];
    for (let i = parseInt(matchRange[3]); i <= parseInt(matchRange[4]); i++) {
      verses.push(i.toString());
    }
    return {
      action: "read",
      book: matchRange[1],
      chapter: matchRange[2],
      verses: verses
    };
  }

  if (command.includes("repeat")) return { action: "repeat" };
  if (command.includes("next")) return { action: "next" };
  if (command.includes("stop")) return { action: "stop" };

  return { action: "unknown" };
}

async function handleCommand(command, displayElement) {
  const result = parseVoiceCommand(command);
  if (result.action === "read") {
    try {
      const response = await fetch(`${SCRIPT_API}?book=${result.book}&chapter=${result.chapter}`);
      const data = await response.json();
      let output = "";

      result.verses.forEach(v => {
        if (data.verses[v]) {
          output += `Verse ${v}: ${data.verses[v]} `;
        }
      });

      displayElement.innerText = output || "Verse(s) not found.";
      speak(output || "Sorry, I couldn't find the verses.");
    } catch (err) {
      console.error("Fetch failed:", err);
      displayElement.innerText = "⚠️ Unable to retrieve scripture.";
      speak("Sorry, I couldn't connect to the server.");
    }
  } else if (result.action === "repeat") {
    speak(displayElement.innerText);
  } else if (result.action === "next") {
    displayElement.innerText = "⏭ Next verse logic not implemented.";
    speak("Next verse logic not ready yet.");
  } else if (result.action === "stop") {
    speechSynthesis.cancel();
  } else {
    displayElement.innerText = "Sorry, I didn't understand.";
    speak("Sorry, I didn't understand that.");
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1;
  utterance.rate = 0.95;
  speechSynthesis.speak(utterance);
}

