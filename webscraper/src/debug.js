'use strict';
require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

const BROWSER_PATH = process.env.BROWSER_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('Launching Chrome to debug page structure…');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: BROWSER_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  console.log('Navigating to listing page…');
  await page.goto('https://www.collegedekho.com/colleges-in-india/', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  // Wait longer for JS to render
  await new Promise(r => setTimeout(r, 5000));

  // Dump all unique tag+class combinations to understand DOM
  const info = await page.evaluate(() => {
    const body = document.body.innerHTML;

    // Find all anchor tags with /colleges/ in href
    const anchors = Array.from(document.querySelectorAll('a[href*="/colleges/"]'));
    const collegeLinks = anchors
      .map(a => ({ href: a.getAttribute('href'), text: a.textContent.trim().substring(0, 60) }))
      .filter(a => a.text.length > 2)
      .slice(0, 30);

    // Find any elements that have "lakh" or fee-like text
    const feeEls = Array.from(document.querySelectorAll('*'))
      .filter(el => el.children.length === 0 && /\d{2,},\d{3}/.test(el.textContent))
      .map(el => ({
        tag: el.tagName,
        cls: el.className?.toString().substring(0, 80),
        text: el.textContent.trim().substring(0, 60),
      }))
      .slice(0, 10);

    // Grab first 3000 chars of body text
    const bodyText = document.body.innerText.substring(0, 3000);

    return { collegeLinks, feeEls, bodyText };
  });

  fs.writeFileSync('debug_output.json', JSON.stringify(info, null, 2));
  console.log('\n=== College Links found ===');
  info.collegeLinks.forEach(l => console.log(`  ${l.text.padEnd(50)} → ${l.href}`));

  console.log('\n=== Fee Elements found ===');
  info.feeEls.forEach(f => console.log(`  <${f.tag}> [${f.cls}] → ${f.text}`));

  console.log('\n=== Body text (first 2000 chars) ===');
  console.log(info.bodyText.substring(0, 2000));

  // Also dump full HTML to file
  const html = await page.content();
  fs.writeFileSync('debug_page.html', html);
  console.log('\nFull HTML saved to debug_page.html');

  await browser.close();
  console.log('\nDone!');
})();
