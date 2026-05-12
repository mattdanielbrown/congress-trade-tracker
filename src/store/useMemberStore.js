import { create } from 'zustand';
import { detectClusters } from '../lib/correlationEngine';

const useMemberStore = create((set, get) => ({
  // Raw Data
  members: [],
  trades: [],
  signals: [],
  
  // Loading States
  isLoadingMembers: false,
  isLoadingTrades: false,
  error: null,

  // Setters
  setMembers: (members) => set({ members }),
  setTrades: async (trades) => {
    const signals = await detectClusters(trades);
    set({ trades, signals });
  },
  setSignals: (signals) => set({ signals }),
  setLoadingMembers: (isLoadingMembers) => set({ isLoadingMembers }),
  setLoadingTrades: (isLoadingTrades) => set({ isLoadingTrades }),
  setError: (error) => set({ error }),

  // Derived/Computed Helpers
  getTradesByMember: (memberName) => {
    return get().trades.filter(t => t.member === memberName);
  },
  
  getTopSectors: () => {
    const trades = get().trades;
    if (!trades.length) return [];

    // Mock ticker to sector mapping since the raw API data doesn't provide it
    const sectorMap = {
      'PLTR': 'Defense & Tech',
      'RTX': 'Defense',
      'NVDA': 'Technology',
      'AAPL': 'Technology',
      'TSLA': 'Automotive',
      'AMD': 'Technology',
      'MSFT': 'Technology',
      'ENPH': 'Energy',
      'DWAC': 'Media',
      'AMZN': 'Consumer'
    };

    const sectorCounts = {};
    trades.forEach(t => {
      const sector = sectorMap[t.ticker] || 'Other';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });

    const total = trades.length;
    return Object.entries(sectorCounts)
      .map(([sector, count]) => ({
        sector,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  },
  
  getTotalTrades30d: () => {
    const trades = get().trades;
    if (!trades.length) return 0;
    
    // Find the latest date in the dataset to act as "now"
    const latestDateStr = trades.reduce((latest, current) => {
      if (!latest) return current.date;
      return new Date(current.date) > new Date(latest) ? current.date : latest;
    }, null);

    if (!latestDateStr) return 0;

    const thirtyDaysAgo = new Date(latestDateStr);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return trades.filter(t => new Date(t.date) >= thirtyDaysAgo).length;
  }
}));

export default useMemberStore;
