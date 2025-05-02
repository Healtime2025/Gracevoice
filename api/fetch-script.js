export default async function handler(req, res) {
  const { book, chapter, translation = "web" } = req.query;

  if (!book || !chapter) {
    return res.status(400).json({ error: "Missing book or chapter." });
  }

  const query = `${book} ${chapter}`;
  const apiUrl = `https://bible-api.com/${encodeURIComponent(query)}?translation=${translation}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ error: "Verse not found." });
    }

    // Convert to GraceVoice format: { verses: { "1": "...", "2": "..." } }
    const verses = {};
    data.verses.forEach(v => {
      verses[v.verse.toString()] = v.text.trim();
    });

    return res.status(200).json({
      book: data.book_name,
      chapter: data.chapter,
      verses: verses
    });

  } catch (err) {
    return res.status(500).json({ error: "GraceVoice fetch error", details: err.message });
  }
}
