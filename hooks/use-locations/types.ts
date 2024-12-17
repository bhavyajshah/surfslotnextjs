export interface Spot {
  id: string;
  name: string;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  active: boolean;
  comingSoon?: boolean;
  spots: Spot[];
}

export interface UseLocationsReturn {
  locations: Location[];
  isLoading: boolean;
  addLocation: () => Promise<void>;
  removeLocation: (locationId: string) => Promise<void>;
  toggleLocation: (locationId: string) => Promise<void>;
  toggleSpot: (locationId: string, spotId: string) => Promise<void>;
}