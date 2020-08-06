"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserDefaults = exports.runOptionsDefaults = void 0;
const runOptionsDefaults = {
    paginationMax: 1,
    optimize: false,
};
exports.runOptionsDefaults = runOptionsDefaults;
const browserDefaults = {
    headless: true,
    args: [
        "--lang=en-GB",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
    ],
    defaultViewport: null,
    pipe: true,
    slowMo: 10,
};
exports.browserDefaults = browserDefaults;
