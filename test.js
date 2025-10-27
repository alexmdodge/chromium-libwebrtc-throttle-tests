const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');
const { throttle, wait, NETWORK_PROFILE } = require('./scripts/throttling');
const { getWebrtcInternals } = require('./scripts/webrtc');
const { getTestPage, joinAndPublishTestPage } = require('./scripts/dom');
const { storeTestResults } = require('./scripts/logging');

const TEST_USER_DATA_DIR = path.join(__dirname, 'test-user-data');
const TEST_RESULTS = path.join(__dirname, 'results');
const TEST_MEDIA_FILE = path.join(__dirname, 'media/bbb_1080p.y4m');

async function test(testName, chromePath, testPageUrl) {
  const sessionId = new Date().toISOString().replace(/[:.]/g, '-');

  const userDataDir = path.join(TEST_USER_DATA_DIR, sessionId);
  const testResultsDir = path.join(TEST_RESULTS, sessionId);

  let testFn = (page, cdp) => { throw new Error(`Test (${testName}) could not be found`) };

  try {
    const testFile = path.join(__dirname, 'tests', path.basename(testName));
    testFn = require(testFile).run;
  } catch (e) {
    console.error('Error loading test file: ', e);
    process.exit(1);
  }

  await fs.ensureDir(userDataDir);
  await fs.ensureDir(testResultsDir);

  try {
    await fs.ensureFile(TEST_MEDIA_FILE);
  } catch (e) {
    console.error('BBB test asset under /media is not yet converted to .y4m. Run `npm run bootstrap` with ffmpeg installed.')
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      `--use-file-for-fake-video-capture=${TEST_MEDIA_FILE}`,
      '--enable-logging',
      '--vmodule=*/webrtc/*=1',
      '--force-fieldtrials=WebRTC-RtcEventLogNewFormat/Disabled/',
      `--webrtc-event-logging=${testResultsDir}`
    ],
    userDataDir,
    headless: false
  });

  const client = await browser.target().createCDPSession();
  await client.send("Browser.setDownloadBehavior", {
    behavior: 'allowAndName',
    downloadPath: testResultsDir,
    eventsEnabled: true,
  });
  
  // Conditionally show WebRTC Internals for Log Purposes
  const { internals } = await getWebrtcInternals(browser, testResultsDir);
  
  const { page, config, pageCDP } = await getTestPage(browser, testPageUrl);
  await joinAndPublishTestPage(page, config);
  await testFn(page, pageCDP);
  
  await internals.bringToFront();
  await wait(5);
  await internals.click('#dump-click-target');
  await wait(5);

  await browser.close();

  await storeTestResults(sessionId, {
    results: testResultsDir,
    userData: userDataDir,
  })
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node test.js <test-name> <chrome-binary-path> <test-page-url>');
  console.error('Example: node test.js "uplink-300kbps" "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "http://localhost:8080/test.html"');
  process.exit(1);
}

const [testName, chromePath, testPageUrl] = args;
test(testName, chromePath, testPageUrl).catch(console.error);
