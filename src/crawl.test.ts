import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML, crawlPage } from "./crawl";

describe('Crawl', () => {
    test('normalizeURL function should return normalized URL', () => {
      expect(normalizeURL('https://blog.boot.dev/path/')).toEqual('blog.boot.dev/path');
      expect(normalizeURL('https://blog.boot.dev/news//')).toEqual('blog.boot.dev/news');
      expect(normalizeURL('http://blog.boot.dev/path/')).toEqual('blog.boot.dev/path');
    });

    test('normalizeURL should throw error if not valid url', () => {
      expect(() => normalizeURL('a')).toThrow();
    });

    test('getURLsFromHTML to absolute URL', () => {
      expect(getURLsFromHTML(`
      <!DOCTYPE html>
      <html>
      <body>
        <a href="/page1">Page 1</a>
        <a href="/page2">Page 2</a>
      </body>
      </html>
    `, 'https://blog.boot.dev')).toEqual(['https://blog.boot.dev/page1', 'https://blog.boot.dev/page2']);
    });

    test('getURLsFromHTML ignore absolute URL', () => {
      expect(getURLsFromHTML(`
      <!DOCTYPE html>
      <html>
      <body>
        <a href="/page1">Page 1</a>
        <a href="https://github.com/hale-pretty">Page 2</a>
      </body>
      </html>
    `, 'https://blog.boot.dev')).toEqual(['https://blog.boot.dev/page1']);
    });
});