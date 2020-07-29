var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ msg: 'Working' });
});
  
module.exports = router;

 // const indeed = require('indeed-scraper');
// const { LinkedinScraper, events, IData } = require('linkedin-jobs-scraper');
// const { executablePath } = require('puppeteer');
//   // const queryOptions = {
//     //   host: 'www.indeed.com',
//     //   query: 'javascript',
//     //   city: 'fort lauderdale, fl',
//     //   radius: '25',
//     //   level: '',
//     //   jobType: '',
//     //   maxAge: '3',
//     //   sort: 'date',
//     //   limit: 1
//     // };
//     (async () => {
//       // Each scraper instance is associated with one browser.
//       // Concurrent queries will run on different pages within the same browser instance.
//       const scraper = new LinkedinScraper({
//         headless: true,
//         // slowMo: 100,
//       });
//       // const browser = await scraper.launch({executablePath: 'chrome'})
//     let allData=[]
//     // Add listeners for scraper events
//     scraper.on(events.scraper.data, (data) => {
//         console.log(
//             // data.description.length,
//             // `Query='${data.query}'`,
//             // `Location='${data.location}'`,
//             // `Title='${data.title}'`,
//             // `Company='${data.company}'`,
//             // `Place='${data.place}'`,
//             // `Date='${data.date}'`,
//             // `Link='${data.link}'`,
//             // `senorityLevel='${data.senorityLevel}'`,
//             // `function='${data.jobFunction}'`,
//             // `employmentType='${data.employmentType}'`,
//             // `industries='${data.industries}'`,
//         );
//         allData.push(data)
//     });
//     scraper.on(events.scraper.error, (err) => {
//         console.error(err);
//     });
//     scraper.on(events.scraper.end, () => {
//         console.log('All done!');
//         //console.log(allData)
//         console.log(allData.length)
//     });
//     // Add listeners for puppeteer browser events
//     scraper.on(events.puppeteer.browser.targetcreated, () => {
//     });
//     scraper.on(events.puppeteer.browser.targetchanged, () => {
//     });
//     scraper.on(events.puppeteer.browser.targetdestroyed, () => {
//     });
//     scraper.on(events.puppeteer.browser.disconnected, () => {
//     });
//     // Custom function executed on browser side to extract job description
//     const descriptionProcessor = () => document.querySelector(".description__text")
//         .innerText
//         .replace(/[\s\n\r]+/g, " ")
//         .trim();
//     // Run queries concurrently
//     // await 
//     // Promise.all([
//       let ourpro = scraper.run(
//             "software engineer",
//             "new york city",
//             {
//                 paginationMax: 1,
//             }
//         )
//       console.log('dsadsa',ourpro)
//       await ourpro
//         // scraper.run(
//         //     ["Developer", "Software Engineer"],
//         //     ["San Francisco", "New York"],
//         //     {
//         //         paginationMax: 1,
//         //         descriptionProcessor,
//         //         optimize: true, // Block resources such as images, fonts etc to improve bandwidth usage
//         //     }
//         // )
//     // ]);
//     // Close browser
//     await scraper.close();
// })();
// /* GET home page. */
// // router.get('/', function(req, res, next) {
// //   indeed.query(queryOptions).then(res => {
// //     console.log(res)
// //     allData.push(res)
// //     console.log(allData)
// //     allData=allData.flat()
// //     console.log(allData)
// //   });
// // })
// module.exports = router;