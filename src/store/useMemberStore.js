import { create } from 'zustand';

const useMemberStore = create((set) => ({
  members: [],
  isLoading: false,
  error: null,
  setMembers: (members) => set({ members }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useMemberStore;
