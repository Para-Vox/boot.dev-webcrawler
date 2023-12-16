const { test, expect } = require('@jest/globals')
const { normalizeURL, getURLsFromHTML } = require('./crawl.js');

test('normalize protocol', 
    () => {
    expect(normalizeURL("https://website.com/chibi")).toBe("website.com/chibi");
});

test('normalize /', 
    () => {
    expect(normalizeURL("https://website.com/chibi/")).toBe("website.com/chibi");
});

test('getLinkFromBody',
    () => {
        expect(
            getURLsFromHTML(`<!DOCTYPE html><p>Hello world</p><a href="mizu"></a>`, 'https://website.com'))
            .toStrictEqual([new URL('https://website.com/mizu')]);
});