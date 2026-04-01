# ScreenV1 Task Checklist

- [x] Phase 1: Project Setup & Foundation
  - [x] Set up monorepo structure
  - [x] Initialize Next.js web app
  - [x] Initialize Express server
  - [x] Create root package.json
- [x] Phase 2: Backend API Server
  - [x] Set up Express (CORS, body parser, etc)
  - [x] Configure PostgreSQL with pg
  - [x] Set up DB schema (users, videos tables)
  - [x] Auth routes and JWT middleware
  - [x] Videos routes (upload, list, access)
- [x] Phase 3: Authentication UI (Web App)
  - [x] Setup global styles and design system
  - [x] Create root layout
  - [x] Create landing page (`page.js`)
  - [x] Create login page
  - [x] Create register page
  - [x] Create API helper routines
- [x] Phase 4: Chrome Extension
  - [x] Create `manifest.json` (V3)
  - [x] Build popup UI with PiP toggle
  - [x] Write background service worker
  - [x] Build offscreen document for recording logic
  - [x] Wire up server upload logic
- [x] Phase 5: Dashboard & Video Library
  - [x] Dashboard layout with Navbar
  - [x] Video Library grid and VideoCard components
  - [x] Add drag/drop UploadModal functionality
- [x] Phase 6: Video Editor
  - [x] Editor page setup
  - [x] VideoPlayer with canvas overlays
  - [x] Timeline component
  - [x] ToolPanel (Trim, Combine, Blur, Highlight, Music)
  - [x] Blur and Highlight tools (UI logic)
  - [x] Music Panel (UI logic)
  - [x] Setup FFmpeg.wasm video processor in web worker
- [x] Phase 7: Polish & Integration
  - [x] Refine responsive design
  - [x] Add toast notifications and error handling (initial)
  - [x] Deep linking and shortcuts
  - [x] Align CSS variables across components

# Audit: Bugs & Improvements

## Critical bugs to fix first
- [x] 1. Navbar user display: store user object in localStorage on login/register alongside the token, or use api.getMe() in the Navbar effect
- [x] 2. Editor fetches all videos: add api.getVideo(id) to web/src/lib/api.js using GET /api/videos/:id
- [x] 3. Editor save calls wrong endpoint: add api.replaceVideo(id, formData) to api.js and use it in handleSave()

## High priority missing features
- [x] 4. Webcam PiP compositing: implement canvas compositing in offscreen.js
- [x] 5. 6-minute limit: add a setTimeout in offscreen.js after mediaRecorder.start() that auto-stops at 360s
- [x] 6. UploadModal: create the drag-and-drop upload component
- [x] 7. Tool sub-panels: ToolPanel should render contextual panel based on activeTool

## Architecture improvements
- [x] 8. FFmpeg in Web Worker: wrap videoProcessor.js in a Worker
- [x] 9. CORS restriction: pass { origin: ['http://localhost:3000', 'chrome-extension://<id>'] } to cors() in server/index.js
- [x] 10. Replace alert()/confirm() with a lightweight toast/modal system

## Lower priority gaps
- [x] 11. Register page: add confirm password field and client-side match validation
- [x] 12. Timeline: add blur/highlight/music track rows
- [x] 13. Deep linking: uncomment and implement chrome.tabs.create in offscreen.js
- [x] 14. Keyboard shortcuts in editor (spacebar = play/pause, [/] = move trim handles)
