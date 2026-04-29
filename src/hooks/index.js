import useMemberStore from '../store/useMemberStore';

export const useTrades = () => useMemberStore(state => state.trades);
export const useMembers = () => useMemberStore(state => state.members);
export const useSignals = () => useMemberStore(state => state.signals);
export const useIsLoading = () => useMemberStore(state => state.isLoadingTrades || state.isLoadingMembers);

export const useStoreHelpers = () => {
	const getTradesByMember = useMemberStore(state => state.getTradesByMember);
	const getTopSectors = useMemberStore(state => state.getTopSectors);
	const getTotalTrades30d = useMemberStore(state => state.getTotalTrades30d);

	return { getTradesByMember, getTopSectors, getTotalTrades30d };
};

export { useDataSync } from './useDataSync';
