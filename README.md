AI OptiBotX — PWA (candlestick version)
=======================================

This package contains a client-side PWA using Lightweight Charts (candlestick series)
and TwelveData REST API. For sub-minute candlesticks (5s/10s/etc.) the app aggregates
incoming `quote` responses into small candles client-side.

Important:
- Replace API_KEY in app.js with your TwelveData API key or implement a serverless
  proxy to keep the key secret.
- TwelveData free plan may limit frequency; if you need higher reliability consider
  a small serverless function as a proxy or a paid WebSocket feed.

To test locally:
- Unzip and run a static server (python -m http.server) and open in browser.
- Ensure CORS allows requests (TwelveData is public).

Files:
- index.html
- style.css
- app.js  (replace API key)
- manifest.json
- service-worker.js
- icon-192.png, icon-512.png (copied if present)
- README.md
