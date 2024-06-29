import { argv } from 'node:process';
import { crawlPage } from './crawl.js'

async function main() {
    if (argv.length < 3) {
        console.error('No URL is found')
        return
    } else if (argv.length > 3) {
        console.error(` Only one URL can be entered.
                        Please re-enter.`)
        return
    }
    console.log(`URL: ${argv[2]} will be crawled`)
    const result = await crawlPage(argv[2], argv[2], {})
    printReport(result)
  }

const printReport = (result: {[key: string]: number}) => {
  console.log('The report is starting...')
  const entries: [string, string | number][] = Object.entries(result)
  entries.forEach(([key, value]) => {
  console.log(`Found ${value} internal links to ${key}`)
  }) 
}


main()