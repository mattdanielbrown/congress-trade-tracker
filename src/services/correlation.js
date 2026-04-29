/**
 * CorrelationService
 * 
 * Responsible for detecting trade clusters and calculating signal confidence scores.
 */

export const CorrelationService = {
  /**
   * Detects clusters where multiple members trade the same ticker.
   * @param {Array} trades - List of normalized trade objects.
   * @param {number} windowDays - The time window in days to look for clusters.
   * @returns {Array} List of detected clusters with metadata.
   */
  detectClusters: (trades, windowDays = 14) => {
    const clusters = {};
    
    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedTrades.forEach(trade => {
      const ticker = trade.ticker;
      if (!clusters[ticker]) {
        clusters[ticker] = [];
      }
      clusters[ticker].push(trade);
    });

    // Filter for clusters with 2+ members within the window (placeholder logic)
    return Object.entries(clusters)
      .map(([ticker, tickerTrades]) => ({
        ticker,
        count: tickerTrades.length,
        members: [...new Set(tickerTrades.map(t => t.member))],
        trades: tickerTrades,
        confidenceScore: calculateConfidenceScore(tickerTrades)
      }))
      .filter(cluster => cluster.count >= 2);
  },

  /**
   * Assigns a confidence score (0-100) based on signal strength.
   */
  calculateConfidenceScore: (clusterTrades) => {
    let score = 0;
    
    // Base score for number of members
    score += Math.min(clusterTrades.length * 10, 50);
    
    // Check for committee overlap (placeholder)
    const committeeOverlap = false; 
    if (committeeOverlap) score += 30;

    // Check for time proximity
    const firstTrade = new Date(clusterTrades[0].date);
    const lastTrade = new Date(clusterTrades[clusterTrades.length - 1].date);
    const dayDiff = (lastTrade - firstTrade) / (1000 * 60 * 60 * 24);
    
    if (dayDiff <= 7) score += 20;

    return Math.min(score, 100);
  }
};

function calculateConfidenceScore(trades) {
  return CorrelationService.calculateConfidenceScore(trades);
}
