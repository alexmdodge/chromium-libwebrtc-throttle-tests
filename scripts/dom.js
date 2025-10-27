// Configures / Triggers Test Runs for Supplied Pages

const puppeteer = require('puppeteer');
const { wait, throttle } = require('./throttling');

/**
 * Add new test app handlers here, which are a combination of business logic and
 * test page element ids for quick selection and triggering of test logic.
 */
const TEST_APP_HANDLERS = {
    'p2p': {
        // For pages which require authentication, add a query parameter which accepts a token    
        'token': undefined,

        // Element id for 'joining' which may setup media or request camera or mic permissions
        'join': '#startButton',

        // Establish the peer connection and start media upload
        'publish': '#callButton',
    },
    'sfu': {
        // For pages which require authentication, add a query parameter which accepts a token
        'token': undefined, // Replace with service token

        // Element id for 'joining' which may setup media or request camera or mic permissions
        'join': '#join-button',

        // Establish the peer connection and start media upload
        'publish': undefined,
    },

    // Add your page here. Note that each variable is optional. If none are provided the
    // page will still run and execute if it's automatically setup to do so.
    // 'page-alias': {
    //     'token': '<your-service-token>',
    //     'join': '#joinButtonId',
    //     'publish': '#publishWebRTCMediaButtonId',
    // },
}

/**
 * @param {puppeteer.Browser} browser From which to setup the page
 * @param {string} url Test page URL provided from command line
 */
async function getTestPage(browser, url) {
    let config = TEST_APP_HANDLERS['sfu'];

    if (url.includes('peerconnection')) {
        config = TEST_APP_HANDLERS['p2p'];
    }

    // Add your page URL handling / setup here
    // if (url.includes('unique-url-structure')) {
    //     config = TEST_APP_HANDLERS['page-alias'];
    // }
    console.log(`Using configuration ${JSON.stringify(config, null, 2)}`);

    // Apply token as query parameter if needed
    let finalUrl = url;
    if (config.token) {
        const separator = url.includes('?') ? '&' : '?';
        finalUrl = `${url}${separator}token=${config.token}`;
    }

    // Navigate to the test page
    const page = await browser.newPage();
    await page.goto(finalUrl);
    console.log(`Test page loaded: ${finalUrl}`);

    // Setup throttling for CDP
    const pageCDP = await page.createCDPSession();
    await throttle(pageCDP);

    return { page, config, pageCDP };
}

/**
 * @param {puppeteer.Page} page From which to join and publish
 */
async function joinAndPublishTestPage(page, config = {}) {
    // Join the session
  if (config.join) {
    await page.click(config.join);
    console.log('Clicked join button');
  }

  await wait(3);

  // Start publishing if needed
  if (config.publish) {
    await page.click(config.publish);
    console.log('Clicked publish button');
  }
}

module.exports = {
    getTestPage,
    joinAndPublishTestPage,
}