import { Selector } from 'testcafe';

require('isomorphic-fetch');
const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');

fixture(`Getting Started`)
    .page(`http://devexpress.github.io/testcafe/example`)
    .beforeEach(async t => {});

test('My first test', async t => {
    const result = await fetch('http://localhost:9222/json');
    const j = await result.json();

    console.log(j[0].webSocketDebuggerUrl);
    const browser = await puppeteer.connect({
        browserWSEndpoint: j[0].webSocketDebuggerUrl
    });
    const pages = await browser.pages();
    const page = pages[0];
    await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);
    await t
        .typeText('#developer-name', 'John Smith')
        .click('#submit-button')

        // Use the assertion to check if the actual header text is equal to the expected one
        .expect(Selector('#article-header').innerText)
        .eql('Thank you, John Smith!');

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
});

// test('My first test 1', async t => {
//     await t
//         .typeText('#developer-name', 'John Smith')
//         .click('#submit-button');

//     const articleHeader = await Selector('.result-content').find('h1');

//     // Obtain the text of the article header
//     let headerText = await articleHeader.innerText;
// });
