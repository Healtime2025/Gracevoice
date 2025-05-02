// GraceVoice Natural Voice Command Parser

function parseVoiceCommand(command) {
  command = command.toLowerCase();

  // Match: "read genesis 1 verse 5"
  const matchSingle = command.match(/read\s+(\w+)\s+(\d+)\s+verse\s+(\d+)/);
  if (matchSingle) {
    return {
      action: "read",
      book: matchSingle[1],
      chapter: matchSingle[2],
      verses: [matchSingle[3]]
    };
  }

  // Match: "read john 3 verses 16 to 18"
  const matchRange = command.match(/read\s+(\w+)\s+(\d+)\s+verses\s+(\d+)\s+to\s+(\d+)/);
  if (matchRange) {
    const verses = [];
    const start = parseInt(matchRange[3]);
    const end = parseInt(matchRange[4]);
    for (let i = start; i <= end; i++) {
      verses.push(i.toString());
    }
    return {
      action: "read",
      book: matchRange[1],
      chapter: matchRange[2],
      verses: verses
    };
  }

  // Match: "repeat" or "next" or "stop"
  if (command.includes("repeat")) return { action: "repeat" };
  if (command.includes("next")) return { action: "next" };
  if (command.includes("stop")) return { action: "stop" };

  return { action: "unknown" };
}

// Example Usage
const userCommand = "Read Genesis 1 verse 1";
const result = parseVoiceCommand(userCommand);

if (result.action === "read") {
  const api = `https://your-script-url?book=${result.book}&chapter=${result.chapter}`;
  fetch(api)
    .then(res => res.json())
    .then(data => {
      result.verses.forEach(v => {
        const verseText = data.verses[v];
        console.log(`Verse ${v}: ${verseText}`);
        const utterance = new SpeechSynthesisUtterance(verseText);
        speechSynthesis.speak(utterance);
      });
    });
} else {
  console.log("Voice command action:", result.action);
}
