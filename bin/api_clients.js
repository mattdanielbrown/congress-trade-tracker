import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const POLITICIAN_TRACKER_KEY = process.env.VITE_POLITICIAN_TRADE_TRACKER_API_KEY || process.env.POLITICIAN_TRADE_TRACKER_API_KEY;
const AINVEST_KEY = process.env.VITE_AINVEST_API_KEY || process.env.AINVEST_API_KEY;

export const ApiClients = {
	/**
	 * Fetch latest trades from Politician Trade Tracker via RapidAPI.
	 * Endpoint: /api/trades/latest
	 */
	async fetchLatestTradesFromPoliticianTracker() {
		if (!POLITICIAN_TRACKER_KEY) {
			console.warn("⚠️ POLITICIAN_TRADE_TRACKER_API_KEY is not set. Skipping Politician Trade Tracker API.");
			return [];
		}

		try {
			console.log("📡 Fetching latest trades from Politician Trade Tracker...");
			const response = await axios.get('https://politician-trade-tracker1.p.rapidapi.com/trades/latest', {
				headers: {
					'X-RapidAPI-Key': POLITICIAN_TRACKER_KEY,
					'X-RapidAPI-Host': 'politician-trade-tracker1.p.rapidapi.com'
				}
			});
			return response.data;
		} catch (error) {
			console.error("❌ Error fetching from Politician Trade Tracker:", error.message);
			return [];
		}
	},

	/**
	 * Fetch trades for a specific ticker from AInvest API.
	 * Requires AInvest API Key (Bearer token).
	 */
	async fetchTradesFromAInvest(ticker, page = 1, size = 10) {
		if (!AINVEST_KEY) {
			console.warn("⚠️ AINVEST_API_KEY is not set. Skipping AInvest API.");
			return [];
		}

		try {
			console.log(`📡 Fetching trades for ${ticker} from AInvest API...`);
			const response = await axios.get(`https://openapi.ainvest.com/open/ownership/congress`, {
				params: { ticker, page, size },
				headers: {
					'Authorization': `Bearer ${AINVEST_KEY}`
				}
			});
			return response.data?.data?.data || [];
		} catch (error) {
			console.error(`❌ Error fetching from AInvest for ${ticker}:`, error.message);
			return [];
		}
	}
};
