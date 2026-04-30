export function detectClusters(trades) {
  // Group trades by ticker
  const tradesByTicker = {};
  
  trades.forEach(trade => {
    if (!trade.ticker || trade.ticker === 'N/A') return;
    if (!tradesByTicker[trade.ticker]) {
      tradesByTicker[trade.ticker] = [];
    }
    tradesByTicker[trade.ticker].push(trade);
  });

  const signals = [];

  Object.entries(tradesByTicker).forEach(([ticker, tickerTrades]) => {
    // Sort trades by date ascending to easily find windows
    const sortedTrades = [...tickerTrades].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Check for 14-day rolling windows with >= 3 unique members
    for (let i = 0; i < sortedTrades.length; i++) {
      const windowStart = new Date(sortedTrades[i].date);
      const membersInWindow = new Set();
      const windowTrades = [];
      
      let typeCounts = { Buy: 0, Sell: 0 };

      for (let j = i; j < sortedTrades.length; j++) {
        const currentTradeDate = new Date(sortedTrades[j].date);
        // Date diff in days
        const diffDays = Math.abs((currentTradeDate - windowStart) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 14) {
          membersInWindow.add(sortedTrades[j].member);
          windowTrades.push(sortedTrades[j]);
          if (sortedTrades[j].type === 'Buy') typeCounts.Buy++;
          if (sortedTrades[j].type === 'Sell') typeCounts.Sell++;
        } else {
          break; // Since it's sorted, subsequent trades will be > 14 days
        }
      }

      if (membersInWindow.size >= 3) {
        // We found a cluster! Calculate stats for the signal
        const primaryDirection = typeCounts.Buy > typeCounts.Sell ? 'Buy' : 'Sell';
        const isSymmetric = (typeCounts.Buy === 0 && typeCounts.Sell > 0) || (typeCounts.Sell === 0 && typeCounts.Buy > 0);
        
        let signalLabel = `${primaryDirection} Cluster`;
        if (isSymmetric) signalLabel = `Symmetric ${primaryDirection}`;
        if (typeCounts.Buy >= 4) signalLabel = 'Strong Buy';
        if (typeCounts.Sell >= 4) signalLabel = 'Strong Sell';

        // Base confidence + member scale + symmetry bonus
        const confidence = Math.min(99, Math.floor(65 + (membersInWindow.size * 5) + (isSymmetric ? 10 : 0)));

        signals.push({
          ticker,
          signal: signalLabel,
          confidence,
          count: membersInWindow.size,
          description: `${membersInWindow.size} legislators executed trades (${primaryDirection}-heavy) within a 14-day window.`,
          recentDate: windowTrades[windowTrades.length - 1].date
        });
        
        // Break out to avoid duplicate overlapping signals for the same ticker. 
        break; 
      }
    }
  });

  // Sort signals by confidence
  return signals.sort((a, b) => b.confidence - a.confidence);
}
