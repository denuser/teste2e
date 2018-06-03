const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50
        // args: ['--start-fullscreen']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1800, height: 900 });

    // Enable both JavaScript and CSS coverage
    await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);
    // Navigate to page

    await page.goto('http://www.dyadyatok.ru/');

    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.dismiss();
    });
    await page.evaluate(() => alert('This message is inside an alert box'));

    // Disable both JavaScript and CSS coverage
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage()
    ]);
    let totalBytes = 0;
    let usedBytes = 0;
    const coverage = [...jsCoverage, ...cssCoverage];
    for (const entry of coverage) {
        totalBytes += entry.text.length;
        for (const range of entry.ranges) {
            usedBytes += range.end - range.start - 1;
        }
    }
    console.log(`Bytes used: ${(usedBytes / totalBytes) * 100}%`);
    pti.write(jsCoverage);
    await browser.close();

    // nyc report --reporter=html
})();
