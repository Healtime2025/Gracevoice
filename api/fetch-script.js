// /api/fetch-script.js

export default async function handler(req, res) {
  const { book, chapter, start = 1, end = 999, translation = "web" } = req.query;

  // Validate inputs
  if (!book || !chapter) {
    return res.status(400).json({ error: "❌ Missing book or chapter." });
  }

  try {
    // Construct API URL
    const query = `${book} ${chapter}`;
    const apiUrl = `https://bible-api.com/${encodeURIComponent(query)}?translation=${translation}`;

    // Fetching data from the API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      // Handling HTTP errors
      return res.status(response.status).json({ error: `❌ API Error: ${response.statusText}` });
    }

    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ error: "❌ Verse not found." });
    }

    // Convert API response to GraceVoice format
    const verses = {};
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
      chapter: data.chapter,
      verses: verses
    });

  } catch (error) {
    console.error("❌ GraceVoice fetch error:", error);
    return res.status(500).json({ error: "❌ Server Error", details: error.message });
  }
}
