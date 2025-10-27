// Specific Handlers / Page Setup for WebRTC Internals

const puppeteer = require('puppeteer');
const { wait } = require('./throttling');

/**
 * Optional internal page which can be triggered during the test to ease
 * log gathering triggers from.
 *
 * @param {puppeteer.Browser} browser Instance of Puppeteer browser to pull pages from
 * @param {string} results Test results directory in which to store files
 */
async function getWebrtcInternals(browser, results) {
    const internals = await browser.newPage();
    await internals.goto('chrome://webrtc-internals');
    await wait(1);

    // Setup throttling for CDP
    const internalsCDP = await internals.createCDPSession();
    internalsCDP.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: results,
    });

    // Get all elements with the class
    const elements = await internals.$$('.peer-connection-dump-root');

    // Unfurl all of the WebRTC dropdowns
    if (elements.length > 1) {
        await elements[0].click();
    }

    await internals.click('#dump-checkbox');
    await wait(3);

    return { internals, internalsCDP };
}

module.exports = {
    getWebrtcInternals,
}