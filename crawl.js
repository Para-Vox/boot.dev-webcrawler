const url = require('node:url');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function normalizeURL(input) {

    const myURL = new URL(input);
    let Path = `${myURL.host}${myURL.pathname}`;
    if (Path.length > 0 && Path.slice(-1) === '/') {
        Path = Path.slice(0, -1);
    }
    return Path;
}

function getURLsFromHTML(htmlbody, baseURL){ 

    const output = [];
    const dom = new JSDOM(htmlbody);
    dom.window.document.querySelectorAll('a').forEach((element,number)=> {
        output[number] = 
           element.href.includes(baseURL.toString()) ? new URL(element.href) : new URL(element.href, baseURL);
    });
    return output
}

async function crawlPage(baseURL = URL, currentURL = baseURL, pages = new Map()){

    if(baseURL.host !== currentURL.host){ return pages; }
    if(pages.has(currentURL.toString())){ return pages.set(currentURL.toString(), pages.get(currentURL.toString()) + 1); }
    if(currentURL.toString() === baseURL.toString()){ pages.set(currentURL.toString(), 0); }
    else { pages.set(currentURL.toString(), 1); }

    console.log(`Crawling: ${currentURL.toString()}`);
    const response = await fetch(currentURL);
    if(response.status >= 399){ console.log(`${response.status} error response code... aborting crawl`); return pages;}
    if(!response.headers.get('content-type').includes('text/html')) {  console.log(`${response.headers.get('content-type')} content-type returned`); return pages;}
    const body = await response.text();
    const nextURLs = getURLsFromHTML(body, baseURL)
    for(const nextURL of nextURLs){
        pages = await crawlPage(baseURL, nextURL, pages);
    }
    return pages;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}