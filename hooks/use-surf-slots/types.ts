export interface SurfSlot {
  id: string;
  date: string;
  location: string;
  spot: string;
  conditions: {
    waveHeight: string;
    wind: string;
    tide: string;
    bestTimeToSurf?: string[];
  };
}