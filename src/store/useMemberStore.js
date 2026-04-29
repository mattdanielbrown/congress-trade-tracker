import { create } from 'zustand';

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
  setTrades: (trades) => set({ trades }),
  setSignals: (signals) => set({ signals }),
  setLoadingMembers: (isLoadingMembers) => set({ isLoadingMembers }),
  setLoadingTrades: (isLoadingTrades) => set({ isLoadingTrades }),
  setError: (error) => set({ error }),

  // Derived/Computed Helpers
  getTradesByMember: (memberName) => {
    return get().trades.filter(t => t.member === memberName);
  },
  
  getTopSectors: () => {
    // This is a placeholder for actual sector mapping logic
    // Currently, we just mock it for the UI
    return [{ sector: 'Technology', percentage: 34 }];
  },
  
  getTotalTrades30d: () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return get().trades.filter(t => new Date(t.date) >= thirtyDaysAgo).length;
  }
}));

export default useMemberStore;
