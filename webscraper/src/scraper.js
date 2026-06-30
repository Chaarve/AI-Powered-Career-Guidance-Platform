'use strict';
require('dotenv').config();

const puppeteer = require('puppeteer');
const { connect, disconnect } = require('./db');
const College = require('./models/College');
const {
  parseFeeRange,
  parseNirfRank,
  normalizePackage,
  detectLevel,
  sleep,
} = require('./utils/helpers');

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE_URL     = 'https://www.collegedekho.com';
const LISTING_URL  = `${BASE_URL}/colleges-in-india/`;
const MAX_PAGES    = parseInt(process.env.MAX_PAGES    || '30',  10);
const DELAY_MS     = parseInt(process.env.DELAY_MS     || '2500', 10);
const MAX_COLLEGES = parseInt(process.env.MAX_COLLEGES || '0',   10);
const HEADLESS     = process.env.HEADLESS !== 'false';

// Use system Chrome / Edge — no bundled Chromium needed
const BROWSER_PATH = process.env.BROWSER_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// ─── Browser setup ────────────────────────────────────────────────────────────
async function launchBrowser() {
  console.log(`🚀  Launching Chrome → ${BROWSER_PATH}`);
  return puppeteer.launch({
    headless: HEADLESS ? 'new' : false,
    executablePath: BROWSER_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1366,900',
    ],
    defaultViewport: { width: 1366, height: 900 },
  });
}

async function newPage(browser) {
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );
  page.setDefaultNavigationTimeout(60000);
  page.setDefaultTimeout(60000);
  // Block images, media, fonts — keep CSS/JS for rendering
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const rt = req.resourceType();
    if (['image', 'media', 'font'].includes(rt)) req.abort();
    else req.continue();
  });
  return page;
}

// ─── Extract slugs from page JSON-LD ─────────────────────────────────────────
// The page embeds a JSON-LD ItemList with all college URLs — most reliable source
async function extractSlugsFromPage(page) {
  return page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const s of scripts) {
      try {
        const data = JSON.parse(s.textContent);
        if (data['@type'] === 'ItemList' && data.itemListElement) {
          return data.itemListElement.map(item => {
            const url = item.url || '';
            const m = url.match(/\/colleges\/([^/]+)$/);
            return m ? m[1] : null;
          }).filter(Boolean);
        }
      } catch {}
    }
    return [];
  });
}

// ─── Scrape college card data from listing ────────────────────────────────────
async function scrapeListingCards(page) {
  return page.evaluate(() => {
    const cards = [];

    // Each college card is inside .col-md-12 > .box within .collegeBlock
    const boxes = Array.from(document.querySelectorAll('.collegeBlock .col-md-12 .box'));

    for (const box of boxes) {
      // College name & href
      const nameEl = box.querySelector('.titleSection h2 a, .titleBar h2 a, h2 a');
      if (!nameEl) continue;
      const name = nameEl.textContent.trim();
      const href = nameEl.getAttribute('href') || '';
      const slug = href.match(/\/colleges\/([^/\s?#]+)/)?.[1] || '';
      if (!slug || !name) continue;

      // Location: city, state from ul.info
      const infoItems = Array.from(box.querySelectorAll('ul.info li'));
      let city = '', state = '';
      for (const li of infoItems) {
        const text = li.textContent.trim();
        // Location item typically has a location icon or contains comma-separated city, state
        if (text.includes(',')) {
          const parts = text.split(',').map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            city = parts[0];
            state = parts[1];
            break;
          }
        }
      }

      // College type (Government/Private/Public)
      let type = '';
      for (const li of infoItems) {
        const t = li.textContent.trim();
        if (/Government|Private Unaided|Private|Public/i.test(t)) {
          type = t.match(/Government|Private Unaided|Private|Public/i)?.[0] || '';
          break;
        }
      }

      // Rating & reviews
      const ratingEl = box.querySelector('.collegeRate');
      let rating = null, reviews = null;
      if (ratingEl) {
        const rt = ratingEl.textContent.replace(/\s+/g, ' ').trim();
        const rm = rt.match(/([\d.]+)/);
        if (rm) rating = parseFloat(rm[1]);
      }
      const reviewEl = box.querySelector('a[href*="reviews"]');
      if (reviewEl) {
        const rm2 = reviewEl.textContent.match(/(\d+)/);
        if (rm2) reviews = parseInt(rm2[1], 10);
      }

      // Fee range from h3 inside .fessSection
      const feeEls = Array.from(box.querySelectorAll('.fessSection h3, h3'));
      let feeRaw = '';
      for (const el of feeEls) {
        const t = el.textContent.trim();
        if (/\d+,\d+/.test(t) || /\d+\s*Lac/i.test(t)) {
          feeRaw = t;
          break;
        }
      }

      // Avg/Median package  
      const pkgEls = Array.from(box.querySelectorAll('.fessSection h3'));
      let avgPkg = '';
      for (const el of pkgEls) {
        const t = el.textContent.trim();
        if (/Lac/i.test(t) && !/,/.test(t)) {
          avgPkg = t;
          break;
        }
      }
      // Fallback: look for "N Lacs Avg Package" pattern in full text
      const fullText = box.textContent;
      if (!avgPkg) {
        const pm = fullText.match(/([\d.]+\s*Lacs?)\s*(?:Avg|Median)\s*Package/i);
        if (pm) avgPkg = pm[1];
      }

      // NIRF Rank
      const nirfMatch = fullText.match(/#(\d+)\s*NIRF/i);
      const nirfRank = nirfMatch ? parseInt(nirfMatch[1], 10) : null;

      // Accreditations
      const accreds = [];
      for (const acc of ['UGC', 'NAAC', 'AICTE', 'NBA', 'EQUIS', 'ISO', 'NCHMCT']) {
        if (fullText.includes(acc)) accreds.push(acc);
      }

      // Entrance exams — near "Exams" label
      const exams = [];
      const examPattern = /\b(JEE\s*(?:Main|Advanced)?|NEET(?:\s*PG|\s*UG)?|CAT|XAT|MAT|GMAT|CLAT|CUET(?:\s*PG)?|GATE|CMAT|IIFT|IIT\s*JAM|CCMT|NIMCET|NATA|MFM|IPU\s*CET|GCET|TANCET|TNEA|KEAM)\b/gi;
      let em;
      while ((em = examPattern.exec(fullText)) !== null) {
        const e = em[0].trim().replace(/\s+/g, ' ');
        if (!exams.includes(e)) exams.push(e);
      }

      // Shortlisted by
      const slMatch = fullText.match(/Shortlisted by\s+([\d,]+)\+?\s*students/i);
      const shortlistedBy = slMatch ? parseInt(slMatch[1].replace(/,/g, ''), 10) : null;

      // Total courses
      const coursesMatch = fullText.match(/Course and Fee\s*\((\d+)\)/i);
      const totalCourses = coursesMatch ? parseInt(coursesMatch[1], 10) : null;

      cards.push({
        name, slug, href,
        city, state, type,
        rating, reviews,
        feeRaw, avgPkg, nirfRank,
        accreds, exams,
        shortlistedBy, totalCourses,
      });
    }

    return cards;
  });
}

// ─── Scrape per-college courses page ─────────────────────────────────────────
async function scrapeCollegeCourses(page, slug) {
  const url = `${BASE_URL}/colleges/${slug}-courses`;
  let loaded = false;
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    loaded = true;
  } catch {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      loaded = true;
    } catch (err) {
      console.warn(`\n   ⚠️  Courses page timeout [${slug}]: ${err.message.substring(0, 50)}`);
      return [];
    }
  }
  if (!loaded) return [];
  await sleep(1500);
  const courses = await page.evaluate(() => {
    const results = [];

    // Strategy 1: Find table rows with course info
    const rows = Array.from(document.querySelectorAll('table tr'));
    for (const row of rows) {
      const cells = Array.from(row.querySelectorAll('td, th'));
      if (cells.length < 2) continue;
      const name = cells[0]?.textContent.trim();
      if (!name || name.length < 3 || /course\s*name/i.test(name)) continue;

      const feeText = cells.find(c => /\d{3}/.test(c.textContent))?.textContent.trim() || '';
      const durText = cells.find(c => /\d+\s*(Year|Yr|Month|Sem)/i.test(c.textContent))?.textContent.trim() || '';
      const feeNum = feeText.replace(/[₹,\s]/g, '').match(/^\d+$/)?.[0];

      results.push({
        name,
        duration: durText,
        fees: feeNum ? parseInt(feeNum, 10) : null,
        feesRaw: feeText,
      });
    }

    // Strategy 2: Text scanning for course name patterns
    if (results.length === 0) {
      const allText = document.body.innerText;
      const lines = allText.split('\n').map(l => l.trim()).filter(l => l.length > 2);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          /^(B\.|M\.|MBA|MCA|BCA|BE\b|B\.?Tech|M\.?Tech|MBBS|LLB|LLM|BA\b|B\.?Sc|MA\b|M\.?Sc|PhD|Ph\.D|Diploma|Certificate|BBA|BArch|MArch|BCom|MCom|BEd|MEd|BPharma?|MPharma?|MD\b|MS\b|BAMS|BHMS|BDS|MDS|BPT|MPT|BHMCT|MHMCT|BHM\b|D\.Pharma|GNM\b|ANM\b|BMLT|DMLT|B\.?Plan|M\.?Plan|B\.?Des|M\.?Des|PGDM\b|PGPM\b|Executive\s+MBA)/i.test(line) 
          && line.length < 200
        ) {
          let duration = '', fees = null, feesRaw = '';

          // Look at subsequent lines for duration & fees
          for (let j = i + 1; j <= Math.min(i + 4, lines.length - 1); j++) {
            const next = lines[j];
            if (!duration && /\d+\s*(Year|Yr|Month|Sem)/i.test(next)) {
              duration = next;
            }
            if (!feesRaw && /^[₹\d][\d,.\s]*$/.test(next) && next.length < 20) {
              feesRaw = next;
              const feeNum2 = feesRaw.replace(/[₹,\s]/g, '').match(/^\d+$/)?.[0];
              fees = feeNum2 ? parseInt(feeNum2, 10) : null;
            }
          }

          results.push({ name: line, duration, fees, feesRaw });
        }
      }
    }

    return results.slice(0, 200);
  });

  return courses;
}

// ─── Map raw data → College document ─────────────────────────────────────────
function buildDoc(card, courses) {
  const feeRange = parseFeeRange(card.feeRaw);

  const mappedCourses = (courses || [])
    .filter(c => c.name && c.name.length > 2)
    .map(c => ({
      name:     c.name.substring(0, 200),
      level:    detectLevel(c.name),
      duration: c.duration || '',
      fees:     c.fees ? Math.abs(c.fees) : null,
      feesRaw:  (c.feesRaw || '').substring(0, 50),
      mode:     'Full Time',
    }));

  return {
    name:           card.name,
    slug:           card.slug,
    location: {
      city:   card.city,
      state:  card.state,
    },
    type:           card.type || '',
    rating:         card.rating,
    reviews:        card.reviews,
    accreditations: card.accreds || [],
    feeRange,
    avgPackage:     normalizePackage(card.avgPkg),
    nirfRank:       card.nirfRank,
    entranceExams:  card.exams || [],
    courses:        mappedCourses,
    shortlistedBy:  card.shortlistedBy,
    totalCourses:   card.totalCourses,
    sourceUrl:      `${BASE_URL}${card.href}`,
    scrapedAt:      new Date(),
  };
}

// ─── Upsert college to MongoDB ────────────────────────────────────────────────
async function upsertCollege(doc) {
  try {
    await College.findOneAndUpdate(
      { slug: doc.slug },
      { $set: doc },
      { upsert: true, new: true, runValidators: false }
    );
    return true;
  } catch (err) {
    if (err.code !== 11000) {
      console.error(`   ❌  DB error [${doc.name}]: ${err.message}`);
    }
    return false;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   CollegeDekho Scraper → MongoDB             ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  await connect();
  const browser = await launchBrowser();
  const listPage   = await newPage(browser);
  const detailPage = await newPage(browser);

  let totalSaved = 0, totalSkipped = 0;
  const seenSlugs = new Set();

  try {
    for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
      if (MAX_COLLEGES > 0 && totalSaved >= MAX_COLLEGES) {
        console.log(`\n🎯  MAX_COLLEGES (${MAX_COLLEGES}) reached. Stopping.`);
        break;
      }

      const url = pageNum === 1 ? LISTING_URL : `${LISTING_URL}?page=${pageNum}`;
      console.log(`\n📄  Page ${pageNum}/${MAX_PAGES}: ${url}`);

      let loaded = false;
      for (let attempt = 1; attempt <= 3 && !loaded; attempt++) {
        try {
          await listPage.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
          loaded = true;
        } catch {
          try {
            await listPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
            loaded = true;
          } catch (e2) {
            console.warn(`\n   ⚠️  Page ${pageNum} load attempt ${attempt} failed: ${e2.message.substring(0, 60)}`);
            await sleep(3000);
          }
        }
      }
      if (!loaded) { console.warn(`\n   ❌  Skipping page ${pageNum} after 3 failed attempts.`); continue; }
      await sleep(2000);

      // Get college slugs from JSON-LD (most reliable)
      const jsonSlugs = await extractSlugsFromPage(listPage);
      console.log(`   📋  JSON-LD slugs: ${jsonSlugs.length}`);

      // Get card data (name, location, fees, etc.)
      const cards = await scrapeListingCards(listPage);
      console.log(`   🗂️   Card data: ${cards.length} cards`);

      // Build a slug→card map for enrichment
      const cardMap = {};
      for (const c of cards) {
        if (c.slug) cardMap[c.slug] = c;
      }

      // Process each slug from JSON-LD
      const slugsToProcess = jsonSlugs.length > 0 ? jsonSlugs : cards.map(c => c.slug);

      for (const slug of slugsToProcess) {
        if (MAX_COLLEGES > 0 && totalSaved >= MAX_COLLEGES) break;
        if (!slug || seenSlugs.has(slug)) { totalSkipped++; continue; }
        seenSlugs.add(slug);

        // Get card data if available, otherwise build a minimal card
        const card = cardMap[slug] || { name: slug, slug, href: `/colleges/${slug}`, city: '', state: '', type: '', rating: null, reviews: null, feeRaw: '', avgPkg: '', nirfRank: null, accreds: [], exams: [], shortlistedBy: null, totalCourses: null };

        // If card found but no name, skip
        if (!card.name || card.name === slug) {
          // Try to get name from the college page
        }

        process.stdout.write(`\n   🏫  ${card.name.substring(0, 50).padEnd(52)}`);

        // Scrape courses from detail page
        let courses = [];
        try {
          courses = await scrapeCollegeCourses(detailPage, slug);
        } catch (err) {
          console.warn(`\n   ⚠️  Courses failed [${slug}]: ${err.message.substring(0,50)}`);
          // Recreate detail page if it crashed
          try { await detailPage.reload({ timeout: 10000 }).catch(() => {}); } catch {}
        }
        await sleep(DELAY_MS);

        const doc = buildDoc(card, courses);
        const saved = await upsertCollege(doc);
        if (saved) totalSaved++;

        const stateLabel = card.state || 'N/A';
        process.stdout.write(`→ ${courses.length} courses | ${stateLabel.padEnd(18)} | ${saved ? '✓ saved' : '✗ skip'}`);
      }

      // Check for next page link
      const hasNext = await listPage.evaluate(() => {
        return !!document.querySelector('a[href*="?page="], .pagination a[rel="next"], a:is([href*="page="])');
      });
      if (!hasNext && pageNum > 1) {
        console.log(`\n\n📭  No more pages after page ${pageNum}.`);
        break;
      }

      await sleep(DELAY_MS);
    }
  } finally {
    await browser.close();

    const line = '═'.repeat(55);
    console.log(`\n\n${line}`);
    console.log(`✅  Done!  Saved/Updated: ${totalSaved} | Skipped: ${totalSkipped}`);
    console.log(`${line}\n`);

    await disconnect();
  }
}

main().catch(err => {
  console.error('\n💥 Fatal:', err.message);
  process.exit(1);
});
