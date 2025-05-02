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
- ⚙️ **CORS-safe API proxy** for secure Google Apps Script usage

---

## 🛠️ Project Structure

```bash
.
├── public/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── api/
│   └── fetch-script.js        # Serverless proxy to Google Apps Script
├── index.html                 # Main voice + manual scripture interface
├── package.json               # Includes node-fetch and deploy scripts
├── README.md
└── vercel.json                # (Optional) Route rewrites for cleaner URLs
