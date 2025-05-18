// /api/fetch-script.js

export default async function handler(req, res) {
  const { book, chapter, start = 1, end = 999, translation = "web", type } = req.query;

  // Validate inputs
  if (!book) {
    return res.status(400).json({ error: "Missing book name." });
  }

  try {
    let apiUrl;

    // Load entire book if type is 'book'
    if (type === "book") {
      apiUrl = `https://bible-api.com/${encodeURIComponent(book)}?translation=${translation}`;
    } else {
      // Load specific chapter or range
      if (!chapter) {
        return res.status(400).json({ error: "Missing chapter for verse selection." });
      }
      const query = `${book} ${chapter}`;
      apiUrl = `https://bible-api.com/${encodeURIComponent(query)}?translation=${translation}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ error: "❌ Verse or book not found." });
    }

    // Convert API response to GraceVoice format
    const verses = {};
    data.verses.forEach(v => {
      if (type === "book" || (v.verse >= start && v.verse <= end)) {
        verses[v.verse.toString()] = v.text.trim();
      }
    });

    if (Object.keys(verses).length === 0) {
      return res.status(404).json({ error: "❌ No verses in this range." });
    }

    return res.status(200).json({
      book: data.reference.split(" ")[0],
      chapter: type === "book" ? "All" : data.chapter,
      verses: verses
    });

  } catch (error) {
    console.error("Error fetching Bible text:", error);
    return res.status(500).json({ error: "❌ GraceVoice fetch error", details: error.message });
  }
}

