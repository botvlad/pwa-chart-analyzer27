AI OptiBotX — PWA for Vercel deployment
=====================================

This archive contains a static PWA ready to deploy on Vercel.

Important:
- The JS file contains a placeholder:
  const API_KEY = "REPLACE_WITH_YOUR_KEY";
  You must replace it with your TwelveData API key *before* deploying, or implement a serverless proxy to keep the key secret.

Quick deploy on Vercel:
1. Unzip and create a new project in Vercel linked to the folder.
2. If you want to keep the API key secret, create a serverless function to proxy requests and add the env var TWELVEDATA_API_KEY in Vercel.
3. Alternatively, edit app.js and set your API key directly (not recommended for public repos).

Local testing:
- Use a simple static server, e.g.:
  python -m http.server 8000
  open http://localhost:8000

Files included:
- index.html
- style.css
- app.js (replace API key)
- manifest.json
- service-worker.js
- icon-192.png
- icon-512.png
- README.md

