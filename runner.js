const createTestCafe = require('testcafe');

let testcafe = null;

createTestCafe('localhost', 1337, 1338)
    .then(tc => {
        testcafe = tc;
        const runner = testcafe.createRunner();

        return runner
            .src(['test.js'])
            .browsers([
                {
                    path: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                    cmd: '--remote-debugging-port=9222 --user-data-dir=c:\\tmp\\111'
                }
            ])
            .run();
    })
    .then(failedCount => {
        console.log(`Tests failed: ${failedCount}`);
        testcafe.close();
    });
