import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { ManualScraper } from './manual_scraper.js';

// Load environment variables from .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CONGRESS_API_KEY = process.env.VITE_CONGRESS_API_KEY;
const BASE_URL = 'https://api.congress.gov/v3';

if (!CONGRESS_API_KEY) {
  console.error("❌ ERROR: VITE_CONGRESS_API_KEY is not set in .env");
  process.exit(1);
}

const congressClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: CONGRESS_API_KEY,
    format: 'json'
  },
});

const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function ingestMembers(congress = 118) {
  let members = [];
  console.log(`📡 Fetching members for the ${congress}th Congress...`);
  try {
    const response = await congressClient.get(`/member`); // Fixed endpoint
    members = response.data.members || [];
    
    console.log(`✅ Successfully fetched ${members.length} members.`);
    
    const outputPath = path.join(DATA_DIR, `members_${congress}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(members, null, 2));
    
    console.log(`💾 Saved members to ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to fetch members from Congress.gov:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
  }

  // Fetch and Filter Trades
  // Calculate start year of the given Congress (Jan 3rd of that year)
  // Formula: 1789 + (congress * 2 - 2). Valid for Congress >= 73 (1933 onwards)
  const startYear = 1789 + (congress * 2 - 2);
  const ELECTION_DATE = new Date(`${startYear}-01-03T00:00:00Z`);
  
  console.log(`\n🕵️  Fetching trades (fallback to manual scraper)...`);
  const trades = await ManualScraper.scrapeHouseDisclosures();
  
  const filteredTrades = trades.filter(trade => {
    return new Date(trade.date) >= ELECTION_DATE;
  });

  console.log(`✅ Filtered trades to current term (>= ${startYear}-01-03): ${filteredTrades.length} trades.`);
  const tradesOutputPath = path.join(DATA_DIR, `trades_${congress}.json`);
  fs.writeFileSync(tradesOutputPath, JSON.stringify(filteredTrades, null, 2));
  console.log(`💾 Saved filtered trades to ${tradesOutputPath}`);

  return members;
}

// Run the ingestion
ingestMembers(118);
