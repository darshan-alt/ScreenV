# ScreenV1

**ScreenV1** is a high-performance, full-stack screen recording and video editing platform. It combines a powerful Chrome Extension for seamless capture with a feature-rich web dashboard and a client-side video editor powered by `FFmpeg.wasm`. Designed for modern content creators, it allows you to record your screen securely and edit your videos entirely offline in the browser.

![ScreenV1 Hero](https://github.com/darshan-alt/ScreenV/blob/main/web/public/hero.png?raw=true)

## 🚀 Key Features

### 📼 Recording (Chrome Extension)
- **High-Quality Capture**: Record your screen, active tab, or entire window at up to 60fps.
- **Circular WebCam PiP**: Real-time Picture-in-Picture compositing directly in the browser document.
- **Automatic Upload**: Recordings are instantly uploaded to your personal dashboard via the REST API.
- **Smart Auto-Stop**: Integrated 6-minute (360s) recording limit to ensure browser memory performance.
- **Modern Architecture**: Built with Manifest V3 and utilizes Offscreen Documents and TabCapture APIs.

### ✂️ Editing (Browser-Based Web App)
- **FFmpeg Web Worker**: Video processing (trimming, exports) runs in a background thread, keeping the UI perfectly responsive.
- **Annotation Tools**: Interactive sub-panels for adding blur regions (masking sensitive data) and colored highlights.
- **Timeline Editor**: Frame-accurate trimming with interactive handles and 30fps real-time preview.
- **Audio Integration**: Upload background music track options with complete volume control and timeline positioning.

### 📂 Management (Dashboard)
- **Premium UI**: Designed with a glassmorphism aesthetic using Next.js 14 and Vanilla CSS.
- **Video Library**: Search, sort, and securely manage all your recordings.
- **Auth & Security**: JWT-based session management with CORS-restricted origin protection.
- **Toast Notifications**: Modern, non-intrusive feedback for every system action.

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router), Vanilla CSS |
| **Video Editing** | [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) |
| **Backend API** | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **Extension** | Chrome Extension API (Manifest V3), Offscreen API |

## 📦 Project Structure

```bash
ScreenV1/
├── web/           # Next.js Frontend (Dashboard & Video Editor)
├── server/        # Express.js API (Auth, Video Management, Postgres)
├── extension/     # Chrome Extension (Screen Recorder & PiP logic)
└── .gemini/       # Project Audit & Documentation
```

## ⚙️ Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (Running on port 5432)

### 2. Backend Setup
```bash
cd server
npm install
# Create a 'screenv1' database in Postgres
# The app will automatically initialize the schema on start
npm start
```

### 3. Frontend Setup
```bash
cd web
npm install
npm run dev
```

### 4. Extension Setup
- Open Chrome and navigate to `chrome://extensions`.
- Enable **Developer Mode**.
- Click **Load Unpacked** and select the `extension/` folder in the root directory.

## 🛡️ Security
- **JWT_SECRET**: Enforced in production to safeguard user sessions.
- **CORS Protection**: Access to the API is strictly restricted to the authorized dashboard and extension workspace.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ for the next generation of content creators.