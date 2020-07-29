const { LinkedinScraper, events, IData } = require('linkedin-jobs-scraper');

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('get data', async (data) => {
            console.log('got data', data)

            // Each scraper instance is associated with one browser.
            // Concurrent queries will run on different pages within the same browser instance.
            const scraper = new LinkedinScraper({
                headless: true,
                // slowMo: 100,
            });

            let allData = []

            // Add listeners for scraper events
            scraper.on(events.scraper.data, (data) => {
                console.log(
                    // data.description.length,
                    // `Query='${data.query}'`,
                    // `Location='${data.location}'`,
                    // `Title='${data.title}'`,
                    // `Company='${data.company}'`,
                    // `Place='${data.place}'`,
                    // `Date='${data.date}'`,
                    // `Link='${data.link}'`,
                    // `senorityLevel='${data.senorityLevel}'`,
                    // `function='${data.jobFunction}'`,
                    // `employmentType='${data.employmentType}'`,
                    // `industries='${data.industries}'`,
                );
                socket.emit('recieve data', data)
                allData.push(data)
            });

            scraper.on(events.scraper.error, (err) => {
                console.error(err);
            });
            scraper.on(events.scraper.end, () => {
                console.log('All done!');
            });

            // Add listeners for puppeteer browser events
            scraper.on(events.puppeteer.browser.targetcreated, () => {
            });
            scraper.on(events.puppeteer.browser.targetchanged, () => {
            });
            scraper.on(events.puppeteer.browser.targetdestroyed, () => {
            });
            scraper.on(events.puppeteer.browser.disconnected, () => {
            });

            // Custom function executed on browser side to extract job description
            const descriptionProcessor = () => document.querySelector(".description__text")
                .innerText
                .replace(/[\s\n\r]+/g, " ")
                .trim();

            // Run queries concurrently
            let jobs = scraper.run(
                data.searchTerm,
                data.location,
                {
                    paginationMax: 1,
                }
            )
            await jobs

            // Close browser
            await scraper.close();
            // res.json({message:allData})

        })
    });
}
