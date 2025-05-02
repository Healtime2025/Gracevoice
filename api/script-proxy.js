export default async function handler(req, res) {
  // ✅ Set CORS headers for all responses
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Validate input
  const { book, chapter } = req.query;
  if (!book || !chapter) {
    return res.status(400).json({ error: "Missing 'book' or 'chapter' parameter." });
  }

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzntpRTmAaDZSP3LJn1X-3nsJeyAr6AMPGg41Du9_Hnh0XFsNwI0o2O6hUVEzEFeT529Q/exec";

  try {
    const endpoint = `${SCRIPT_URL}?book=${encodeURIComponent(book)}&chapter=${encodeURIComponent(chapter)}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Script returned ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ GraceVoice Proxy Error:", err);
    return res.status(500).json({
      error: "GraceVoice Proxy Error",
      details: err.message || "Unknown error occurred"
    });
  }
}
