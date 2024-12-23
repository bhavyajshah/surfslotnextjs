export interface Spot {
  id: string;
  name: string;
  active: boolean;
  conditions?: {
    waveHeight?: string;
    wind?: string;
    tide?: string;
    bestTimeToSurf?: string[];
  };
}

export interface Location {
  id: string;
  name: string;
  city: string;
  active: boolean;
  comingSoon?: boolean;
  spots: Spot[];
}

export interface UseLocationsReturn {
  locations: Location[];
  isLoading: boolean;
  error: string | null;
  updateLocation: (id: string, data: Partial<Location>) => Promise<Location>;
  deleteLocation: (id: string) => Promise<void>;
  toggleSpot: (locationId: string, spotId: string) => Promise<Location>;
  refresh: () => Promise<void>;
  // isAdmin: boolean;
  userLocations: any;
  addUserLocation:any;
  deleteUserLocation: any;
  loadUserLocations:any;
}