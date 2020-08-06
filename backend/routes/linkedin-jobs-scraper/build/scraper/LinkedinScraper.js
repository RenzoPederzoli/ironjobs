console.log("in build banana")

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedinScraper = void 0;
const events_1 = require("events");
const puppeteer_1 = __importDefault(require("puppeteer"));
const events_2 = require("./events");
const states_1 = require("./states");
const defaults_1 = require("./defaults");
const logger_1 = require("../logger/logger");
const utils_1 = require("../utils/utils");
const url = "https://www.linkedin.com/jobs";
const containerSelector = ".results__container.results__container--two-pane";
const linksSelector = ".jobs-search__results-list li a.result-card__full-card-link";
const datesSelector = 'time';
const companiesSelector = ".result-card__subtitle.job-result-card__subtitle";
const placesSelector = ".job-result-card__location";
const descriptionSelector = ".description__text";
const seeMoreJobsSelector = "button.infinite-scroller__show-more-button";
const jobCriteriaSelector = "li.job-criteria__item";
/**
 * Wait for job details to load
 * @param page {Page}
 * @param jobTitle {string}
 * @param jobCompany {string}
 * @param timeout {number}
 * @returns {Promise<{success: boolean, error?: string}>}
 * @private
 */
const _loadJobDetails = (page, jobTitle, jobCompany, timeout = 2000) => __awaiter(void 0, void 0, void 0, function* () {
    const waitTime = 10;
    let elapsed = 0;
    let loaded = false;
    while (!loaded) {
        loaded = yield page.evaluate((jobTitle, jobCompany) => {
            const jobHeaderRight = document.querySelector(".topcard__content-left");
            return jobHeaderRight &&
                jobHeaderRight.innerText.includes(jobTitle) &&
                jobHeaderRight.innerText.includes(jobCompany);
        }, jobTitle, jobCompany);
        if (loaded)
            return { success: true };
        yield utils_1.sleep(waitTime);
        elapsed += waitTime;
        if (elapsed >= timeout) {
            return {
                success: false,
                error: `Timeout on loading job: '${jobTitle}'`
            };
        }
    }
    return { success: true };
});
/**
 * Try to load more jobs
 * @param page {Page}
 * @param seeMoreJobsSelector {string}
 * @param linksSelector {string}
 * @param jobLinksTot {number}
 * @param timeout {number}
 * @returns {Promise<{success: boolean, error?: string}>}
 * @private
 */
const _loadMoreJobs = (page, seeMoreJobsSelector, linksSelector, jobLinksTot, timeout = 2000) => __awaiter(void 0, void 0, void 0, function* () {
    const waitTime = 10;
    let elapsed = 0;
    let loaded = false;
    let clicked = false;
    while (!loaded) {
        if (!clicked) {
            clicked = yield page.evaluate((seeMoreJobsSelector) => {
                const button = document.querySelector(seeMoreJobsSelector);
                if (button) {
                    button.click();
                    return true;
                }
                else {
                    return false;
                }
            }, seeMoreJobsSelector);
        }
        loaded = yield page.evaluate((linksSelector, jobLinksTot) => {
            window.scrollTo(0, document.body.scrollHeight);
            return document.querySelectorAll(linksSelector).length > jobLinksTot;
        }, linksSelector, jobLinksTot);
        if (loaded)
            return { success: true };
        yield utils_1.sleep(waitTime);
        elapsed += waitTime;
        if (elapsed >= timeout) {
            return {
                success: false,
                error: `Timeout on fetching more jobs`
            };
        }
    }
    return { success: true };
});
/**
 * Main class
 * @extends EventEmitter
 * @param options {Object} Puppeteer browser options, for more informations see https://pptr.dev/#?product=Puppeteer&version=v2.0.0&show=api-puppeteerlaunchoptions
 * @constructor
 */
class LinkedinScraper extends events_1.EventEmitter {
    constructor(options) {
        super();
        this._browser = undefined;
        this._state = states_1.states.notInitialized;
        /**
         * Scrape linkedin jobs
         * @param queries {string | Array<string>}
         * @param locations {string | Array<string>}
         * @param options {IRunOptions}
         * @returns {Promise<void>}
         * @private
         */
        this._run = (queries, locations, options) => __awaiter(this, void 0, void 0, function* () {
            let tag;
            let paginationMax = options.paginationMax || 1;
            let descriptionProcessor = options.descriptionProcessor;
            let optimize = !!options.optimize;
            if (!(typeof (queries) === "string" || Array.isArray(queries))) {
                throw new Error(`'queries' parameter must be string or Array`);
            }
            if (!(typeof (locations) === "string" || Array.isArray(locations))) {
                throw new Error(`'locations' parameter must be string or Array`);
            }
            if (!(Number.isInteger(paginationMax) && paginationMax > 0)) {
                throw new Error(`'paginationMax' must be a positive integer`);
            }
            if (descriptionProcessor && typeof (descriptionProcessor) !== "function") {
                throw new Error(`'descriptionProcessor' must be a function`);
            }
            if (!Array.isArray(queries)) {
                queries = [queries];
            }
            if (!Array.isArray(locations)) {
                locations = [locations];
            }
            if (!this._browser) {
                yield this._initialize();
            }
            const page = yield this._browser.newPage();
            // Resources we don't want to load to improve bandwidth usage
            if (optimize) {
                yield page.setRequestInterception(true);
                const resourcesToBlock = [
                    "image",
                    "stylesheet",
                    "media",
                    "font",
                    "texttrack",
                    "object",
                    "beacon",
                    "csp_report",
                    "imageset",
                ];
                page.on("request", request => {
                    if (resourcesToBlock.some(r => request.resourceType() === r)
                        || request.url().includes(".jpg")
                        || request.url().includes(".jpeg")
                        || request.url().includes(".png")
                        || request.url().includes(".gif")
                        || request.url().includes(".css")) {
                        request.abort();
                    }
                    else {
                        request.continue();
                    }
                });
            }
            // Array([query, location])
            const queriesXlocations = queries
                .map(q => locations.map(l => [q, l]))
                .reduce((a, b) => a.concat(b));
            let jobsProcessed = 0;
            for (const tuple of queriesXlocations) {
                const [query, location] = tuple;
                tag = `[${query}][${location}]`;
                logger_1.logger.info(tag, `Query="${query}"`, `Location="${location}"`);
                // Open url
                yield page.goto(url, {
                    waitUntil: 'networkidle0',
                });
                logger_1.logger.info(tag, "Page loaded");
                // Wait form search input selectors
                yield Promise.all([
                    page.waitForSelector("form#JOBS", { timeout: 10000 }),
                    page.waitForSelector(`button[form="JOBS"]`, { timeout: 10000 })
                ]);
                // Clear search inputs
                yield page.evaluate(() => document.querySelector(`form#JOBS input[name="keywords"]`).value = "");
                yield page.evaluate(() => document.querySelector(`form#JOBS input[name="location"]`).value = "");
                // Fill search inputs
                yield page.type(`form#JOBS input[name="keywords"]`, query);
                yield page.type(`form#JOBS input[name="location"]`, location);
                // Wait submit button
                yield page.focus(`button[form="JOBS"]`);
                // Submit search
                yield Promise.all([
                    page.keyboard.press("Enter"),
                    page.waitForNavigation(),
                ]);
                logger_1.logger.info(tag, "Search done");
                // Scroll down page to the bottom
                yield page.evaluate(_ => {
                    window.scrollTo(0, document.body.scrollHeight);
                });
                // Wait for lazy loading jobs
                yield page.waitForSelector(containerSelector);
                let jobIndex = 0;
                // Scroll until there are no more job postings to visit or paginationMax is reached
                let paginationIndex = 0;
                // Pagination loop
                while (++paginationIndex <= paginationMax) {
                    tag = `[${query}][${location}][${paginationIndex}]`;
                    // Get number of all job links in the page
                    const jobLinksTot = yield page.evaluate((linksSelector) => document.querySelectorAll(linksSelector).length, linksSelector);
                    logger_1.logger.info(tag, "Job postings fetched: " + jobLinksTot);
                    // Jobs loop
                    for (jobIndex; jobIndex < jobLinksTot; ++jobIndex) {
                        let jobId, jobLink, jobTitle, jobCompany, jobPlace, jobDescription, jobDate;
                        let jobSenorityLevel, jobFunction, jobEmploymentType, jobIndustries;
                        let loadJobDetailsResponse;
                        try {
                            // Extract job main fields
                            [jobTitle, jobCompany, jobPlace, jobDate] = yield page.evaluate((linksSelector, companiesSelector, placesSelector, datesSelector, jobIndex) => {
                                return [
                                    document.querySelectorAll(linksSelector)[jobIndex].innerText,
                                    document.querySelectorAll(companiesSelector)[jobIndex].innerText,
                                    document.querySelectorAll(placesSelector)[jobIndex].innerText,
                                    document.querySelectorAll(datesSelector)[jobIndex]
                                        .getAttribute('datetime')
                                ];
                            }, linksSelector, companiesSelector, placesSelector, datesSelector, jobIndex);
                            // Load job and extract description: skip in case of error
                            [[jobId, jobLink], loadJobDetailsResponse] = yield Promise.all([
                                page.evaluate((linksSelector, jobIndex) => {
                                    const linkElem = document.querySelectorAll(linksSelector)[jobIndex];
                                    linkElem.click();
                                    return [
                                        linkElem.parentNode.getAttribute("data-id"),
                                        linkElem.getAttribute("href"),
                                    ];
                                }, linksSelector, jobIndex),
                                _loadJobDetails(page, jobTitle, jobCompany),
                            ]);
                            // Check if job details loading has failed
                            if (!loadJobDetailsResponse.success) {
                                const errorMessage = `${tag}\t${loadJobDetailsResponse.error}`;
                                logger_1.logger.error(errorMessage);
                                this.emit(events_2.events.scraper.error, errorMessage);
                                continue;
                            }
                            // Use custom description processor if available
                            if (descriptionProcessor) {
                                jobDescription = yield page.evaluate(`(${descriptionProcessor.toString()})();`);
                            }
                            else {
                                jobDescription = yield page.evaluate((descriptionSelector) => {
                                    return document.querySelector(descriptionSelector).innerText;
                                }, descriptionSelector);
                            }
                            // Extract job criteria fields
                            [jobSenorityLevel, jobFunction, jobEmploymentType, jobIndustries] = yield page.evaluate((jobCriteriaSelector) => {
                                const items = document.querySelectorAll(jobCriteriaSelector);
                                const criteria = [
                                    'Seniority level',
                                    'Job function',
                                    'Employment type',
                                    'Industries'
                                ];
                                const nodeList = criteria.map(criteria => {
                                    const el = Array.from(items)
                                        .find(li => li.querySelector('h3').innerText === criteria);
                                    return el ? el.querySelectorAll('span') : [];
                                });
                                return Array.from(nodeList)
                                    .map(spanList => Array.from(spanList)
                                    .map(e => e.innerText).join(', '));
                            }, jobCriteriaSelector);
                        }
                        catch (err) {
                            const errorMessage = `${tag}\t${err.message}`;
                            this.emit(events_2.events.scraper.error, errorMessage);
                            continue;
                        }
                        // Emit data
                        this.emit(events_2.events.scraper.data, {
                            query: query,
                            location: location,
                            link: jobLink,
                            title: jobTitle,
                            company: jobCompany,
                            place: jobPlace,
                            description: jobDescription,
                            date: jobDate,
                            senorityLevel: jobSenorityLevel,
                            jobFunction: jobFunction,
                            employmentType: jobEmploymentType,
                            industries: jobIndustries,
                        });
                        jobsProcessed++;
                        logger_1.logger.info(tag, `Processed job ${jobsProcessed}`);
                    }
                    if (paginationIndex === paginationMax)
                        break;
                    // Check if there are more job postings to load
                    logger_1.logger.info(tag, "Checking for new job postings to fetch...");
                    const loadMoreResponse = yield _loadMoreJobs(page, seeMoreJobsSelector, linksSelector, jobLinksTot);
                    // Check it loading job postings has failed
                    if (!loadMoreResponse.success) {
                        const errorMessage = `${tag}\t${loadMoreResponse.error}`;
                        logger_1.logger.error(errorMessage);
                        this.emit(events_2.events.scraper.error, errorMessage);
                        break;
                    }
                    yield utils_1.sleep(500);
                }
            }
            // Close page
            yield page.close();
            // Emit end event
            this.emit(events_2.events.scraper.end);
        });
        /**
         * Scrape linkedin jobs
         * @param queries {string | Array<string>}
         * @param locations {string | Array<string>}
         * @param options {IRunOptions}
         * @returns {Promise<void>}
         */
        this.run = (queries, locations, options = defaults_1.runOptionsDefaults) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this._state === states_1.states.notInitialized) {
                    yield this._initialize();
                }
                else if (this._state === states_1.states.initializing) {
                    const timeout = 10000;
                    const waitTime = 10;
                    let elapsed = 0;
                    while (this._state !== states_1.states.initialized) {
                        yield utils_1.sleep(waitTime);
                        elapsed += waitTime;
                        if (elapsed >= timeout) {
                            throw new Error(`Initialize timeout exceeded: ${timeout}ms`);
                        }
                    }
                }
                yield this._run(queries, locations, options);
            }
            catch (err) {
                logger_1.logger.error(err);
                this.emit(events_2.events.scraper.error, err);
            }
        });
        /**
         * Close browser instance
         * @returns {Promise<void>}
         */
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            this._browser && this._browser.removeAllListeners() && (yield this._browser.close());
            this._browser = undefined;
            this._state = states_1.states.notInitialized;
        });
        this.options = options;
    }
    /**
     * Initialize browser
     * @private
     */
    _initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this._state = states_1.states.initializing;
            this._browser && this._browser.removeAllListeners();
            this._browser = yield puppeteer_1.default.launch(Object.assign(Object.assign({}, defaults_1.browserDefaults), this.options));
            this._browser.on(events_2.events.puppeteer.browser.disconnected, () => {
                this.emit(events_2.events.puppeteer.browser.disconnected);
            });
            this._browser.on(events_2.events.puppeteer.browser.targetcreated, () => {
                this.emit(events_2.events.puppeteer.browser.targetcreated);
            });
            this._browser.on(events_2.events.puppeteer.browser.targetchanged, () => {
                this.emit(events_2.events.puppeteer.browser.targetchanged);
            });
            this._browser.on(events_2.events.puppeteer.browser.targetdestroyed, () => {
                this.emit(events_2.events.puppeteer.browser.targetdestroyed);
            });
            this._state = states_1.states.initialized;
        });
    }
}
exports.LinkedinScraper = LinkedinScraper;
/**
 * Enable logger
 * @returns void
 * @static
 */
LinkedinScraper.enableLogger = () => logger_1.logger.enable();
/**
 * Disable logger
 * @returns void
 * @static
 */
LinkedinScraper.disableLogger = () => logger_1.logger.disable();
/**
 * Enable logger info namespace
 * @returns void
 * @static
 */
LinkedinScraper.enableLoggerInfo = () => logger_1.logger.enableInfo();
/**
 * Enable logger error namespace
 * @returns void
 * @static
 */
LinkedinScraper.enableLoggerError = () => logger_1.logger.enableError();
