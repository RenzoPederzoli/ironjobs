declare type BrowserEvent = "disconnected" | "targetchanged" | "targetcreated" | "targetdestroyed";
export interface IData {
    query: string;
    location: string;
    link: string;
    title: string;
    company: string;
    place: string;
    date: string;
    description: string;
    senorityLevel: string;
    jobFunction: string;
    employmentType: string;
    industries: string;
}
declare const events: {
    scraper: {
        data: string;
        error: string;
        end: string;
    };
    puppeteer: {
        browser: {
            disconnected: BrowserEvent;
            targetchanged: BrowserEvent;
            targetcreated: BrowserEvent;
            targetdestroyed: BrowserEvent;
        };
    };
};
export { events };
