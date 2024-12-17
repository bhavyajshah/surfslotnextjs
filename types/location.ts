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