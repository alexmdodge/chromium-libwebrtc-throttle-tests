const puppeteer = require('puppeteer');

const UNLIMITED_BYTES = 125000000;
const NETWORK_PROFILE = {
	UNLIMITED: {
		offline: false,
		latency: 0,
		downloadThroughput: UNLIMITED_BYTES,
		uploadThroughput: UNLIMITED_BYTES,
	},
	UPLOAD_300_KBPS: { uploadThroughput: 37500 },
	DOWNLOAD_300_KBPS: { downloadThroughput: 37500 },
	PACKET_LOSS_20: { packetLoss: 20, latency: 120 },
	PACKET_LOSS_10: { packetLoss: 10, latency: 60 },
	PACKET_LOSS_5: { packetLoss: 5 },
};

/**
 * Throttle a page based a particular profile override.
 *
 * @param {puppeteer.CDPSession} session CDP session to triggering throttling from
 */
async function throttle(session, overrides = {}) {
  const profile = {
    ...NETWORK_PROFILE.UNLIMITED,
    ...overrides,
  }

  await session.send('Network.emulateNetworkConditions', profile);
  console.log(`Throttling profile: ${JSON.stringify(profile, null, 2)}`);
}

async function wait(seconds) {
  console.log(`Waiting ${seconds} seconds...`);
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

module.exports = {
    NETWORK_PROFILE,
    throttle,
    wait,
}