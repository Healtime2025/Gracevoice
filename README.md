# 📖 GraceVoice

**GraceVoice** is a voice-powered scripture assistant designed to bring hands-free Bible reading to anyone, anywhere. Built with accessibility and clarity in mind, it supports both natural voice commands and manual selection for reading scripture aloud in large text.

---

## 🌍 Features

- 🎙️ **Natural voice commands**, such as:
  - “Read Genesis 1 verse 1”
  - “Read John 3 verses 16 to 18”
  - “Repeat”, “Stop”, or “Next”
- 🔊 **Text-to-Speech** playback using your browser
- 👓 **Large-font verse display** – ideal for elderly and low-vision users
- 📱 **PWA-ready** – installable on Android, iPhone, or desktop
- 🌐 **Offline support** via service worker
- ⚙️ **Secure API proxy** to [Bible-API.com](https://bible-api.com) with KJV + WEB support

---

## 🛠️ Project Structure

```bash
.
├── api/
│   └── fetch-script.js        # Proxy to Bible-API.com (KJV + WEB)
├── public/
│   ├── index.html             # Voice + manual scripture interface
│   ├── reader.html            # Auto reader (read?book=John&chapter=3)
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── vercel.json                # Clean route rewrites
├── package.json               # Metadata + node-fetch
├── .gitignore                 # Clean repo settings
└── README.md
