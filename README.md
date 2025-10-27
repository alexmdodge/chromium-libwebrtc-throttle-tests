## Chromium WebRTC Network Test Tooling

Bare-bones CDP based Chromium test tooling for throttled WebRTC testing. Includes automation for:

* WebRTC internal collection
* WebRTC RTP Dump collection
* Chromium verbose logging
* Chromium fake media with high complexity 1080p test asset

## Setup

```sh
npm install
npm run bootstrap
node test.js \
    "uplink-300kbps" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "http://localhost:8080/test.html"
```

See this with real content by executing (on MacOS with Chrome installed):

```sh
node test.js \
    "uplink-300kbps" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "https://alexmdodge.github.io/webrtc-samples/src/content/peerconnection/pc1-loss-stats/"
```

Contents of test runs are timestamped and located in `./results`.

## Debugging

* Event logs can be visualized in: https://fippo.github.io/dump-webrtc-event-log/
* WebRTC dumps can be visualized here: https://rtcstats.github.io/rtcstats/dump-importer/