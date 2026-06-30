'use strict';

/**
 * Parse fee strings like "20,000 - 3,18,000" or "₹1.2 Lacs" into numbers
 */
function parseFeeRange(raw) {
  if (!raw || typeof raw !== 'string') return { min: null, max: null, raw };
  const cleaned = raw.replace(/[₹,\s]/g, '');

  // Pattern: "20000-318000"
  const rangeMatch = cleaned.match(/^(\d+(?:\.\d+)?)(Lacs?|L)?\s*-\s*(\d+(?:\.\d+)?)(Lacs?|L)?$/i);
  if (rangeMatch) {
    const lacMultiplier = (s) => /lacs?|l/i.test(s || '') ? 100000 : 1;
    return {
      min: Math.round(parseFloat(rangeMatch[1]) * lacMultiplier(rangeMatch[2])),
      max: Math.round(parseFloat(rangeMatch[3]) * lacMultiplier(rangeMatch[4])),
      raw,
    };
  }

  // Single value like "7,15,050" or "1.2 Lacs"
  const singleLac = cleaned.match(/^(\d+(?:\.\d+)?)(Lacs?|L)$/i);
  if (singleLac) {
    const val = Math.round(parseFloat(singleLac[1]) * 100000);
    return { min: val, max: val, raw };
  }

  const single = cleaned.match(/^(\d+)$/);
  if (single) {
    const val = parseInt(single[1], 10);
    return { min: val, max: val, raw };
  }

  return { min: null, max: null, raw };
}

/**
 * Parse "4.8(9 Reviews)" → { rating: 4.8, reviews: 9 }
 */
function parseRatingReviews(text) {
  if (!text) return { rating: null, reviews: null };
  const m = text.match(/([\d.]+)\s*\((\d+)\s*Review/i);
  if (m) return { rating: parseFloat(m[1]), reviews: parseInt(m[2], 10) };
  return { rating: null, reviews: null };
}

/**
 * Parse "#30 NIRF" → 30
 */
function parseNirfRank(text) {
  if (!text) return null;
  const m = text.match(/#(\d+)\s*NIRF/i);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * Normalize "1.5 Lacs" → "1.5 Lacs" (keep as string for display)
 */
function normalizePackage(text) {
  if (!text) return null;
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Detect course level from name
 */
function detectLevel(courseName) {
  if (!courseName) return 'Other';
  const n = courseName.toUpperCase();
  if (n.startsWith('PH.D') || n.startsWith('PHD')) return 'PhD';
  if (n.startsWith('M.') || n.startsWith('MBA') || n.startsWith('M ') || n.startsWith('MA') ||
      n.startsWith('MSC') || n.startsWith('M.SC') || n.startsWith('ME') || n.startsWith('MTECH') ||
      n.startsWith('M.TECH') || n.startsWith('MCA') || n.startsWith('PG')) return 'PG';
  if (n.startsWith('B.') || n.startsWith('BE') || n.startsWith('BTECH') || n.startsWith('B.TECH') ||
      n.startsWith('BA') || n.startsWith('BSC') || n.startsWith('BCA') || n.startsWith('BBA') ||
      n.startsWith('MBBS') || n.startsWith('LLB') || n.startsWith('UG')) return 'UG';
  if (n.includes('DIPLOMA') || n.includes('CERTIFICATE')) return 'Diploma';
  return 'Other';
}

/**
 * Extract college slug from URL
 * e.g. https://www.collegedekho.com/colleges/iitm → iitm
 */
function extractSlug(url) {
  if (!url) return null;
  const m = url.match(/\/colleges\/([^/\s?#]+)/);
  return m ? m[1].replace(/\s+$/, '') : null;
}

/**
 * Delay helper
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  parseFeeRange,
  parseRatingReviews,
  parseNirfRank,
  normalizePackage,
  detectLevel,
  extractSlug,
  sleep,
};
