---
description: Test the ScreenV1 API and Web App builds
---

### 🧪 ScreenV1 Testing Workflow

Follow these steps to verify the application:

1. **Start the API Server**
   // turbo
   `npm run dev:server` from the root directory.

2. **Verify API Health**
   Perform a health check using curl:
   ```bash
   curl http://localhost:3001/api/health
   ```

3. **Check Auth Endpoints**
   Attempt to register a test user:
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name": "Tester", "email": "test@example.com", "password": "password123"}'
   ```

4. **Verify Web App Build**
   Run the build command for the web workspace to ensure no compilation errors:
   // turbo
   `npm run build --workspace=web`

5. **Examine Extension Manifest**
   Check for any syntax errors in the Chrome Extension manifest:
   ```bash
   json-lint extension/manifest.json
   ```

6. **Cleanup**
   Stop all running processes.
