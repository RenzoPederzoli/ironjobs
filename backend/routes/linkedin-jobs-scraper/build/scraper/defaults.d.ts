import { LaunchOptions } from "puppeteer";
export interface IRunOptions {
    paginationMax?: number;
    descriptionProcessor?: () => string;
    optimize?: boolean;
}
declare const runOptionsDefaults: IRunOptions;
declare const browserDefaults: LaunchOptions;
export { runOptionsDefaults, browserDefaults };
