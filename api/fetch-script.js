export default async function handler(req, res) {
  // Enable CORS for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { book, chapter } = req.query;
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzntpRTmAaDZSP3LJn1X-3nsJeyAr6AMPGg41Du9_Hnh0XFsNwI0o2O6hUVEzEFeT529Q/exec";

  if (!book || !chapter) {
    return res.status(400).json({ error: "Missing book or chapter in request." });
  }

  try {
    const apiUrl = `${SCRIPT_URL}?book=${encodeURIComponent(book)}&chapter=${encodeURIComponent(chapter)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error("[GraceVoice Proxy Error]", err);
    res.status(500).json({
      error: "GraceVoice Proxy Error",
      details: err.message || "Unexpected error"
    });
  }
}
