const puppeteer = require('puppeteer');
const { throttle, NETWORK_PROFILE, wait } = require('../scripts/throttling');

/**
 * @param {puppeteer.Page} page Page on which the test is running
 * @param {puppeteer.CDPSession} cdp Session through which throttling can be applied
 */
async function run(page, cdp) {
    // wait for target bitrate to ramp
    await wait(20);

    // throttle uplink to 300kbps
    await throttle(cdp, NETWORK_PROFILE.UPLOAD_300_KBPS);
    await wait(20);

    // remove throttling
    await throttle(cdp);

    await wait(30);
}

module.exports = {
    run,
}