import { JSDOM } from 'jsdom';

const normalizeURL = (urlString: string): string => {
  try {
    const urlObj = new URL(urlString)
		let path = urlObj.pathname
		while (path[path.length - 1] === '/') {
			path = path.slice(0, -1)
		}
    return urlObj.hostname + path
  } catch (error) {
		console.error(error)
    throw new Error("Invalid URL: " + urlString)
  }
}

const isRelativeUrl = (value: string): boolean => {
  try {
    new URL(value)
    return false
  } catch(error) {
    return true
  }

}


const getURLsFromHTML = (html: string, baseURL: string): string[] => {
  const dom = new JSDOM(html)
  const document = dom.window.document
  const anchorElements = document.querySelectorAll('a')
  const urls: string[] = []
  for (let anchor of anchorElements) {
    const relURL = anchor.getAttribute('href')
    if (relURL && isRelativeUrl(relURL)) {
      urls.push(baseURL + relURL)
    }}
  return urls
}

async function crawlPageHTML(curURL: string): Promise<string> {
  const response = await fetch(curURL)
  if (response.status >= 400) {
    console.error(`Error: Received status code ${response.status}`)
    throw new Error(`Bad status code`)
  }
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('text/html')) {
    console.error('Error: Received non HTML content')
    throw new Error(`Not html page`)
  }
  const html = await response.text()
  return html  
}

async function crawlPage(baseURL: string, currentURL: string, pages: { [key: string]: number }): Promise<{ [key: string]: number }> {
  // // Check the domain name NOTICE VAR NUMBER
  // const baseUrlObj = new URL(baseURL)
  // const curUrlObj = new URL(currentURL)
  // const baseDomain = baseUrlObj.hostname
  // const curDomain = curUrlObj.hostname
  // if (baseDomain != curDomain) {
  //   return pages
  // }
  let continueCrawlPage = false;
  // Count so lan xuat hien
  const normCurUrl = normalizeURL(currentURL)
  if (!pages.hasOwnProperty(normCurUrl)) {
    pages[normCurUrl] = 0
    continueCrawlPage = true
  }
  pages[normCurUrl]++

  if(!continueCrawlPage) {
    return pages
  }
  
  let htmlText: string = ''
  try {
    htmlText = await crawlPageHTML(currentURL)
  } catch(err) {
    console.error("Cannot crawl page: " + currentURL, err)
  }
  if (!htmlText) {
    return pages
  }
  // Get the ref URLs list NOTICE TAKE RESOLVE 

  const toVisitUrls = getURLsFromHTML(htmlText, baseURL)


  // Recursive crawl ref URLs
  for (let url of toVisitUrls) {
    await crawlPage(baseURL, url, pages)
  }
  return pages
}

export { normalizeURL, getURLsFromHTML, crawlPage };