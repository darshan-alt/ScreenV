# ScreenV1

**ScreenV1** is a high-performance, browser-based screen recording and video editing platform. It combines a powerful Chrome Extension for seamless capture with a feature-rich web dashboard and a client-side video editor powered by `FFmpeg.wasm`.

![ScreenV1 Hero](https://github.com/darshan-alt/ScreenV/blob/main/web/public/hero.png?raw=true)

## 🚀 Features

### 📼 Recording (Chrome Extension)
- **High-Quality Capture**: Record your screen, active tab, or entire window at up to 60fps.
- **Picture-in-Picture (PiP)**: Circular webcam overlay integrated directly into your recording.
- **Automatic Upload**: Recordings are instantly uploaded to your personal dashboard upon completion.
- **Auto-Stop**: Built-in 6-minute maximum recording limit for optimized processing.

### ✂️ Editing (Web App)
- **Client-Side Processing**: Fast video trimming and exports powered by `FFmpeg.wasm` running in a dedicated Web Worker (no server-side rendering lag!).
- **Annotation Tools**: Add blur regions to hide sensitive information or highlights to draw attention.
- **Timeline Editor**: Frame-accurate trimming with interactive handles and real-time playback.
- **Audio Overlays**: Add background music tracks to your recordings.

### 📂 Management (Dashboard)
- **Video Library**: Search, sort, and manage all your recordings in a sleek, glassmorphism-inspired interface.
- **Secure Auth**: Full user authentication with JWT, protected by encrypted PostgreSQL storage.
- **Drag & Drop**: Manually upload existing video files directly to the platform.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), Vanilla CSS, [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/)
- **Extension**: Chrome Extension API (Manifest V3), Offscreen API, TabCapture
- **Styling**: Modern CSS Variables, Glassmorphism, Dark Mode native

## 📦 Project Structure

```bash
ScreenV1/
├── web/           # Next.js Frontend (Dashboard & Video Editor)
├── server/        # Express.js API (Auth, Video Management, DB)
├── extension/     # Chrome Extension (Screen Recorder)
└── .gemini/       # Project Task Tracking & Documentation
```

## ⚙️ Installation

### 1. Backend Setup
```bash
cd server
npm install
# Ensure you have a local PostgreSQL instance running
# Update DATABASE_URL in server/db.js if necessary
npm start
```

### 2. Frontend Setup
```bash
cd web
npm install
npm run dev
```

### 3. Extension Setup
- Open Chrome and navigate to `chrome://extensions`.
- Enable **Developer Mode** (top right).
- Click **Load Unpacked** and select the `extension/` folder.
- Log in to the web app first, then start recording!

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ for creators and educators.