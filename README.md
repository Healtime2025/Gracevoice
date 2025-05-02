# 📖 GraceVoice

GraceVoice is a voice-powered scripture assistant designed to bring hands-free Bible reading to anyone, anywhere. Built with accessibility and clarity in mind, it supports both voice commands and manual selection for reading scripture aloud in large text.

## 🌍 Features

- 🎙️ Natural voice commands like:
  - “Read Genesis 1 verse 1”
  - “Read John 3 verses 16 to 18”
  - “Repeat”, “Stop”, or “Next”
- 🔊 Text-to-Speech playback
- 👓 Large-font verse display (ideal for low-vision users)
- 📱 PWA-ready: Install it on mobile or desktop
- 🌐 Offline-ready with service worker
- ⚙️ CORS-safe API proxy for Google Script endpoints

## 🛠️ Project Structure

```bash
.
├── public/
│   ├── manifest.json
│   └── sw.js
├── script/
│   └── parser.js            # Parses natural voice commands
├── api/
│   └── fetch-script.js      # Vercel serverless proxy to Google Apps Script
├── index.html               # Main user interface
├── README.md
└── package.json             # Includes node-fetch dependency
