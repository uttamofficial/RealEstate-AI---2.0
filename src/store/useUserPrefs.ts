import { create } from 'zustand';
import { UserPrefs } from '@/types/property';

interface UserPrefsStore extends UserPrefs {
  updatePrefs: (updates: Partial<UserPrefs>) => void;
  resetPrefs: () => void;
}

const defaultPrefs: UserPrefs = {
  minPrice: undefined,
  maxPrice: undefined,
  markets: [],
  capRateMin: undefined,
  capRateMax: undefined,
  risk: 'any',
  categories: []
};

export const useUserPrefs = create<UserPrefsStore>((set) => ({
  ...defaultPrefs,
  
  updatePrefs: (updates) => 
    set((state) => ({
      ...state,
      ...updates,
      // Ensure arrays are properly handled
      ...(updates.markets && { markets: [...updates.markets] }),
      ...(updates.categories && { categories: [...updates.categories] })
    })),
    
  resetPrefs: () => set({ ...defaultPrefs })
}));
