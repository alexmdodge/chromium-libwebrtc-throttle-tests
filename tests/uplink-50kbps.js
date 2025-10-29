const puppeteer = require('puppeteer');
const { throttle, NETWORK_PROFILE, wait } = require('../scripts/throttling');

/**
 * @param {puppeteer.Page} page Page on which the test is running
 * @param {puppeteer.CDPSession} cdp Session through which throttling can be applied
 */
async function run(page, cdp) {
    // wait for target bitrate to ramp
    await wait(30);

    // throttle uplink
    await throttle(page, cdp, NETWORK_PROFILE.UPLOAD_50_KBPS);
    await wait(20);

    // remove throttling
    await throttle(page, cdp);

    await wait(60);
}

module.exports = {
    run,
}