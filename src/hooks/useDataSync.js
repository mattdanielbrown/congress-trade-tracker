import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useMemberStore from '../store/useMemberStore';

import enrichedTrades from '../../data/enriched_trades.json';
import membersData from '../../data/members_118.json';

// Simulated API calls
const fetchTrades = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return enrichedTrades;
};

const fetchMembers = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return membersData;
};

export function useDataSync() {
  const { setTrades, setMembers, setLoadingTrades, setLoadingMembers } = useMemberStore();

  const { data: trades, isLoading: isLoadingTrades, isSuccess: isTradesSuccess } = useQuery({
    queryKey: ['trades'],
    queryFn: fetchTrades,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: members, isLoading: isLoadingMembersData, isSuccess: isMembersSuccess } = useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  useEffect(() => {
    setLoadingTrades(isLoadingTrades);
    if (isTradesSuccess && trades) {
      setTrades(trades);
    }
  }, [trades, isLoadingTrades, isTradesSuccess, setTrades, setLoadingTrades]);

  useEffect(() => {
    setLoadingMembers(isLoadingMembersData);
    if (isMembersSuccess && members) {
      setMembers(members);
    }
  }, [members, isLoadingMembersData, isMembersSuccess, setMembers, setLoadingMembers]);
}
