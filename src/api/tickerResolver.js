import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_KEY || process.env.VITE_ALPHA_VANTAGE_API_KEY;

// Alpha Vantage free tier allows 25 requests per day, and 5 per minute.
// We must be extremely careful.
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Predefined alias dictionary for common messy disclosure names
const ALIAS_DICTIONARY = {
	'APPLE INC COM': 'AAPL',
	'APPLE INC': 'AAPL',
	'APPLE COMPUTER': 'AAPL',
	'ALPHABET INC': 'GOOGL',
	'ALPHABET': 'GOOGL',
	'MICROSOFT CORP': 'MSFT',
	'MICROSOFT': 'MSFT',
	'TESLA INC': 'TSLA',
	'TESLA MOTORS': 'TSLA',
	'AMAZON.COM INC': 'AMZN',
	'NVIDIA CORP': 'NVDA',
	'NVIDIA CORPORATION': 'NVDA',
	'PALANTIR TECHNOLOGIES INC': 'PLTR',
	'PALANTIR': 'PLTR',
	'RAYTHEON TECHNOLOGIES': 'RTX',
	'ADVANCED MICRO DEVICES INC': 'AMD',
	'ADVANCED MICRO DEVICES': 'AMD',
	'DIGITAL WORLD ACQUISITION CORP': 'DWAC'
};

// Fallback sectors to avoid API usage for well-known stocks to save AV limits
const FALLBACK_SECTORS = {
	'AAPL': 'Technology',
	'GOOGL': 'Communication Services',
	'MSFT': 'Technology',
	'TSLA': 'Consumer Cyclical',
	'AMZN': 'Consumer Cyclical',
	'NVDA': 'Technology',
	'PLTR': 'Technology',
	'RTX': 'Industrials',
	'AMD': 'Technology',
	'DWAC': 'Communication Services'
};

export class TickerResolver {
	/**
	 * Cleans a raw disclosure name or ticker into a standard ticker symbol.
	 */
	static resolveTicker(rawName) {
		if (!rawName || typeof rawName !== 'string') return 'UNKNOWN';

		const cleanName = rawName.toUpperCase().trim();

		// Check if it's already a clean 1-5 letter ticker (heuristic)
		if (cleanName.length <= 5 && !cleanName.includes(' ')) {
			return cleanName;
		}

		// Check aliases
		for (const [alias, ticker] of Object.entries(ALIAS_DICTIONARY)) {
			if (cleanName.includes(alias)) {
				return ticker;
			}
		}

		// Unresolved
		return 'UNKNOWN';
	}

	/**
	 * Fetches sector data from Alpha Vantage with rate limiting and fallbacks.
	 */
	static async getSectorWithRetry(ticker, retries = 3) {
		if (!ticker || ticker === 'UNKNOWN') return 'Other';
		if (FALLBACK_SECTORS[ticker]) return FALLBACK_SECTORS[ticker];

		if (!ALPHA_VANTAGE_API_KEY) {
			console.warn("⚠️ ALPHA_VANTAGE_KEY missing, using fallback sector.");
			return 'Other';
		}

		const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;

		for (let i = 0; i < retries; i++) {
			try {
				console.log(`[Alpha Vantage] Fetching sector for ${ticker}...`);
				const response = await axios.get(url);

				// Alpha Vantage returns a note if rate limited: "Note": "Thank you for using Alpha Vantage!..."
				if (response.data.Note) {
					const backoff = Math.pow(2, i) * 15000; // Longer backoff for AV (15s, 30s)
					console.warn(`[Alpha Vantage] Rate limited. Retrying in ${backoff}ms...`);
					await sleep(backoff);
					continue;
				}

				if (response.data.Sector) {
					return response.data.Sector;
				} else {
					return 'Other';
				}
			} catch (error) {
				console.error(`[Alpha Vantage] Error fetching sector for ${ticker}:`, error.message);
				if (i === retries - 1) return 'Other';
				await sleep(2000);
			}
		}

		return 'Other';
	}
}
