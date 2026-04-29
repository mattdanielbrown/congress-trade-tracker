/**
 * TickerResolver Service
 * 
 * Maps messy disclosure names (e.g., "APPLE INC COM") to clean tickers (AAPL).
 * In a production scenario, this might ping an API (like Alpha Vantage search endpoint)
 * or use a local fuzzy-match database. We use a static dictionary + basic heuristics here.
 */

const knownMappings = {
  'APPLE INC': 'AAPL',
  'APPLE INC COM': 'AAPL',
  'MICROSOFT CORP': 'MSFT',
  'MICROSOFT CORPORATION': 'MSFT',
  'NVIDIA CORP': 'NVDA',
  'NVIDIA CORPORATION': 'NVDA',
  'TESLA INC': 'TSLA',
  'TESLA MOTORS': 'TSLA',
  'AMAZON.COM INC': 'AMZN',
  'ALPHABET INC': 'GOOGL',
  'ALPHABET INC.': 'GOOGL',
  'META PLATFORMS': 'META',
  'META PLATFORMS INC': 'META',
  'PALANTIR TECHNOLOGIES': 'PLTR',
  'PALANTIR TECHNOLOGIES INC': 'PLTR',
  'ADVANCED MICRO DEVICES': 'AMD',
  'ADVANCED MICRO DEVICES INC': 'AMD',
  'ENPHASE ENERGY': 'ENPH',
  'ENPHASE ENERGY INC': 'ENPH',
  'RAYTHEON TECHNOLOGIES': 'RTX',
  'RTX CORPORATION': 'RTX',
};

export const TickerResolver = {
  /**
   * Resolves a company name or dirty ticker to a clean stock ticker.
   * @param {string} inputName - The raw asset name from the disclosure.
   * @returns {string|null} The resolved ticker or null if unknown.
   */
  resolve: (inputName) => {
    if (!inputName) return null;
    
    let cleanName = inputName.trim().toUpperCase();
    
    // Remove common suffixes that might confuse matching
    cleanName = cleanName.replace(/ COM$/, '').replace(/ CLASS A$/, '').replace(/ CLASS B$/, '').replace(/ COMMON STOCK$/, '').trim();

    // Check exact mapping
    if (knownMappings[cleanName]) {
      return knownMappings[cleanName];
    }

    // Heuristics: if it looks like a ticker (1-5 uppercase letters)
    if (/^[A-Z]{1,5}$/.test(cleanName)) {
      return cleanName;
    }

    // Fallback: If we can't resolve it, return null or the original cleaned string
    // In a real agent workflow, we would log this to a "missing_mappings" file for review.
    return null;
  }
};
