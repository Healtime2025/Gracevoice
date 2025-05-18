// /api/fetch-script.js

export default async function handler(req, res) {
  const { book, chapter, start = 1, end = 999, translation = "web" } = req.query;

  // Validate inputs
  if (!book) {
    return res.status(400).json({ error: "Missing book name." });
  }

  try {
    let verses = {};

    // Load specific chapter or range
    if (!chapter) {
      return res.status(400).json({ error: "Missing chapter for verse selection." });
    }

    // Build API URL for the specific chapter
    const apiUrl = `https://bible-api.com/${encodeURIComponent(book)} ${chapter}?translation=${translation}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ error: "❌ Verse or chapter not found." });
    }

    // Convert API response to GraceVoice format (specific range)
    data.verses.forEach(v => {
      if (v.verse >= start && v.verse <= end) {
        verses[v.verse.toString()] = v.text.trim();
      }
    });

    if (Object.keys(verses).length === 0) {
      return res.status(404).json({ error: "❌ No verses in this range." });
    }

    return res.status(200).json({
      book: data.reference.split(" ")[0],
      chapter,
      verses
    });

  } catch (error) {
    console.error("Error fetching Bible text:", error);
    return res.status(500).json({ error: "❌ GraceVoice fetch error", details: error.message });
  }
}

