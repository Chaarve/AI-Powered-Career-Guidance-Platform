# CollegeDekho Web Scraper 🎓

Scrapes college data from [collegedekho.com](https://www.collegedekho.com/colleges-in-india/) and stores it in **MongoDB** — organized by **state**, **courses**, and **fees**.

---

## 📁 Project Structure

```
webscraper/
├── .env               ← MongoDB URI & scraper settings
├── package.json
└── src/
    ├── scraper.js     ← Main Puppeteer scraper
    ├── query.js       ← CLI query tool
    ├── db.js          ← MongoDB connection
    ├── models/
    │   └── College.js ← Mongoose schema
    └── utils/
        └── helpers.js ← Parser utilities
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) **or** a MongoDB Atlas URI
- (Optional) MongoDB Compass for visual browsing

### Install
```bash
npm install
```

### Configure
Edit `.env` and update your MongoDB URI:
```env
MONGO_URI=mongodb://localhost:27017/collegedekho
MAX_PAGES=30         # Pages to scrape (each page ~15-20 colleges)
DELAY_MS=2500        # Delay between requests (ms)
MAX_COLLEGES=0       # 0 = unlimited
HEADLESS=true        # true = no browser UI
```

---

## 🚀 Run the Scraper

```bash
npm run scrape
# or
node src/scraper.js
```

The scraper will:
1. Open each listing page on collegedekho.com
2. Extract college name, location (city + state), type, fees, NIRF rank, rating, entrance exams
3. Visit each college's `/courses` page to extract all courses + fees
4. **Upsert** everything into MongoDB (`collegedekho` database, `colleges` collection)

---

## 🔍 Query the Data

```bash
# Summary (total colleges, states, fee stats)
node src/query.js

# Colleges in Tamil Nadu
node src/query.js --state "Tamil Nadu"

# Colleges offering B.Tech
node src/query.js --course "B.Tech"

# Colleges with fees below ₹1 Lakh
node src/query.js --fee-max 100000

# Combine filters: MBA colleges in Karnataka
node src/query.js --state "Karnataka" --course "MBA"

# Custom limit
node src/query.js --state "Delhi" --limit 50
```

---

## 📊 MongoDB Schema

Each college document looks like:
```json
{
  "name": "IIT Madras",
  "slug": "iitm",
  "location": { "city": "Chennai", "state": "Tamil Nadu" },
  "type": "Government",
  "rating": 4.8,
  "feeRange": { "min": 5000, "max": 300000, "raw": "5,000 - 3,00,000" },
  "avgPackage": "12.4 Lacs",
  "nirfRank": 1,
  "accreditations": ["AICTE"],
  "entranceExams": ["JEE Advanced", "JEE Main", "CAT"],
  "totalCourses": 98,
  "courses": [
    { "name": "B.Tech", "level": "UG", "duration": "4 Years", "fees": 75116 },
    { "name": "MBA", "level": "PG", "duration": "2 Years", "fees": 300000 }
  ]
}
```

### Useful MongoDB Queries (run in Compass or shell)

```js
// All colleges in Maharashtra
db.colleges.find({ "location.state": "Maharashtra" })

// Colleges with fees under ₹50,000
db.colleges.find({ "feeRange.max": { $lte: 50000 } })

// Colleges offering B.Tech sorted by NIRF rank
db.colleges.find({ "courses.name": /B\.Tech/i }).sort({ nirfRank: 1 })

// Distinct states covered
db.colleges.distinct("location.state")

// Count by state
db.colleges.aggregate([
  { $group: { _id: "$location.state", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

---

## ⚙️ Settings Reference

| Variable       | Default                                      | Description                        |
|----------------|----------------------------------------------|------------------------------------|
| `MONGO_URI`    | `mongodb://localhost:27017/collegedekho`     | MongoDB connection string          |
| `MAX_PAGES`    | `30`                                         | Max listing pages to scrape        |
| `DELAY_MS`     | `2500`                                       | Delay between requests (ms)        |
| `MAX_COLLEGES` | `0`                                          | Max colleges (0 = no limit)        |
| `HEADLESS`     | `true`                                       | `false` = show browser window      |

---

## 📝 Notes

- The scraper uses **upsert** (insert-or-update) so it's safe to re-run without duplicates
- Rate limiting is built in (2.5s delay by default) to avoid getting blocked
- Puppeteer blocks images/fonts to speed up scraping
- All data is stored with `scrapedAt` timestamp for freshness tracking
