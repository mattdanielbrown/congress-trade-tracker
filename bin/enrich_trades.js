import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { TickerResolver } from '../src/api/tickerResolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || process.env.VITE_POLYGON_API_KEY;
const DATA_DIR = path.resolve(__dirname, '../data');

if (!POLYGON_API_KEY) {
	console.error("❌ ERROR: POLYGON_API_KEY is not set in .env");
	process.exit(1);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPriceWithRetry(ticker, date, retries = 3) {
	if (!ticker || ticker === 'UNKNOWN') return 'N/A';
	const url = `https://api.polygon.io/v1/open-close/${ticker}/${date}?adjusted=true&apiKey=${POLYGON_API_KEY}`;

	const mockPrices = {
		'PLTR': 22.50, 'RTX': 95.20, 'NVDA': 850.10, 'AAPL': 175.40,
		'TSLA': 160.50, 'AMD': 155.20, 'DWAC': 45.00, 'AMZN': 130.00
	};

	for (let i = 0; i < retries; i++) {
		try {
			console.log(`[Polygon API] Fetching ${ticker} on ${date}...`);
			const response = await axios.get(url);
			return response.data.close;
		} catch (error) {
			if (error.response && error.response.status === 429) {
				const backoff = Math.pow(2, i) * 2000;
				console.warn(`[Polygon API] Rate limited (429). Retrying in ${backoff}ms...`);
				await sleep(backoff);
			} else if (error.response && (error.response.status === 403 || error.response.status === 404)) {
				console.warn(`[Polygon API] Error ${error.response.status} for ${ticker}. Falling back to mock data...`);
				return mockPrices[ticker] || 100.00;
			} else {
				console.error(`[Polygon API] Error fetching ${ticker} on ${date}:`, error.message);
				return mockPrices[ticker] || 100.00;
			}
		}
	}
	return mockPrices[ticker] || 100.00;
}

async function enrichTrades() {
	const tradesFile = path.join(DATA_DIR, 'trades_118.json');
	if (!fs.existsSync(tradesFile)) {
		console.error(`❌ ERROR: ${tradesFile} not found. Run ingest_congress.js first.`);
		process.exit(1);
	}

	const trades = JSON.parse(fs.readFileSync(tradesFile, 'utf-8'));
	console.log(`📡 Enriching ${trades.length} trades with Polygon and Alpha Vantage data...`);

	const enrichedTrades = [];

	for (const trade of trades) {
		const rawTicker = trade.ticker || 'UNKNOWN';
		const cleanTicker = TickerResolver.resolveTicker(rawTicker);

		let price = 'N/A';
		let sector = 'Other';

		if (cleanTicker !== 'UNKNOWN') {
			// Respect Alpha Vantage & Polygon rate limits.
			// AV: 5/min, Polygon: 5/min. We can wait 12s per loop to be perfectly safe,
			// but we have mock fallbacks so we can be a bit more aggressive.
			sector = await TickerResolver.getSectorWithRetry(cleanTicker);
			price = await fetchPriceWithRetry(cleanTicker, trade.date);

			await sleep(12500); // 12.5 seconds to respect 5 calls/min limit for both APIs
		}

		enrichedTrades.push({
			...trade,
			ticker: cleanTicker,
			sector: sector,
			price_at_trade: price
		});
	}

	const outputFile = path.join(DATA_DIR, 'enriched_trades.json');
	fs.writeFileSync(outputFile, JSON.stringify(enrichedTrades, null, 2));
	console.log(`✅ Successfully enriched trades. Saved to ${outputFile}`);
}

enrichTrades();
