/// <reference types="node" />
import { EventEmitter } from "events";
import { LaunchOptions } from "puppeteer";
import { IRunOptions } from "./defaults";
/**
 * Main class
 * @extends EventEmitter
 * @param options {Object} Puppeteer browser options, for more informations see https://pptr.dev/#?product=Puppeteer&version=v2.0.0&show=api-puppeteerlaunchoptions
 * @constructor
 */
declare class LinkedinScraper extends EventEmitter {
    private _browser;
    private _state;
    options: LaunchOptions;
    constructor(options: LaunchOptions);
    /**
     * Enable logger
     * @returns void
     * @static
     */
    static enableLogger: () => void;
    /**
     * Disable logger
     * @returns void
     * @static
     */
    static disableLogger: () => void;
    /**
     * Enable logger info namespace
     * @returns void
     * @static
     */
    static enableLoggerInfo: () => void;
    /**
     * Enable logger error namespace
     * @returns void
     * @static
     */
    static enableLoggerError: () => void;
    /**
     * Initialize browser
     * @private
     */
    private _initialize;
    /**
     * Scrape linkedin jobs
     * @param queries {string | Array<string>}
     * @param locations {string | Array<string>}
     * @param options {IRunOptions}
     * @returns {Promise<void>}
     * @private
     */
    private _run;
    /**
     * Scrape linkedin jobs
     * @param queries {string | Array<string>}
     * @param locations {string | Array<string>}
     * @param options {IRunOptions}
     * @returns {Promise<void>}
     */
    run: (queries: string | Array<string>, locations: string | Array<string>, options?: IRunOptions) => Promise<void>;
    /**
     * Close browser instance
     * @returns {Promise<void>}
     */
    close: () => Promise<void>;
}
export { LinkedinScraper };
