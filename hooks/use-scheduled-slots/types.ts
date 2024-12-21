export interface SurfSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  spot: string;
  conditions: string;
}

export interface UseScheduledSlotsReturn {
  slots: SurfSlot[];
  isLoading: boolean;
  error: string | null;
  fetchSlots: () => Promise<void>;
}