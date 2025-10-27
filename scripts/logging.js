// Logging Helpers for Parsing and Storing WebRTC Log Results

const path = require('path');
const fs = require('fs-extra');

async function storeTestResults(sessionId, dirs) {
    const { results, userData } = dirs

    const chromeLogPath = path.join(userData, 'chrome_debug.log');
    const targetFileName = 'chrome_debug.log';
    const targetPath = path.join(results, targetFileName);
  
    if (await fs.pathExists(chromeLogPath)) {
      await fs.copy(chromeLogPath, targetPath);
      console.log(`Chrome debug log copied to: ${targetPath}`);
    } else {
      console.log('No Chrome debug log found');
    }
}

module.exports = {
    storeTestResults,
}