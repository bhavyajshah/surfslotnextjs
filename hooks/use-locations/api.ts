import { Location } from './types';

export async function fetchLocationsApi(): Promise<Location[]> {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }
  return response.json();
}

export async function removeLocationApi(locationId: string): Promise<void> {
  const response = await fetch(`/api/locations/${locationId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove location');
  }
}

export async function toggleLocationApi(locationId: string, active: boolean): Promise<void> {
  const response = await fetch(`/api/locations/${locationId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle location');
  }
}

export async function toggleSpotApi(locationId: string, spotId: string, active: boolean): Promise<void> {
  const response = await fetch(`/api/locations/${locationId}/spots/${spotId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle spot');
  }
}