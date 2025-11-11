import { create } from 'zustand';
import { CattleReport, UserLocation } from '@/types';

interface CowState {
  userLocation: UserLocation | null;
  setUserLocation: (location: UserLocation) => void;
  
  cattleReports: CattleReport[];
  setCattleReports: (reports: CattleReport[]) => void;
  addCattleReport: (report: CattleReport) => void;
  
  selectedReport: CattleReport | null;
  setSelectedReport: (report: CattleReport | null) => void;
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  userVotes: Record<string, 'up' | 'down'>;
  setUserVote: (reportId: string, vote: 'up' | 'down') => void;
}

export const useCowStore = create<CowState>((set) => ({
  userLocation: null,
  setUserLocation: (location: UserLocation) =>
    set({ userLocation: location }),

  cattleReports: [],
  setCattleReports: (reports: CattleReport[]) =>
    set({ cattleReports: reports }),
  addCattleReport: (report: CattleReport) =>
    set((state) => ({
      cattleReports: [report, ...state.cattleReports],
    })),

  selectedReport: null,
  setSelectedReport: (report: CattleReport | null) =>
    set({ selectedReport: report }),

  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  userVotes: {},
  setUserVote: (reportId: string, vote: 'up' | 'down') =>
    set((state) => ({
      userVotes: {
        ...state.userVotes,
        [reportId]: vote,
      },
    })),
}));
