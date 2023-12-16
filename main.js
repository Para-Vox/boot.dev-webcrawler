const { argv } = require('node:process');
const { crawlPage, normalizeURL } = require('./crawl.js');

async function main(){

    if(process.argv.length != 3){ console.log(`Please provide a single arguement: baseURL`); return;}

    console.log(`Starting webcrawl at: ${argv[2]}`);
    const pages = await crawlPage(new URL(argv[2]));
    pages.forEach((v,k) => { console.log(`URL: ${k} had ${v} links.`) });
}

main()