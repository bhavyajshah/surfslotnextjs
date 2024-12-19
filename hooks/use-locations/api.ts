import { Location } from './types';

export async function fetchLocations(): Promise<Location[]> {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch locations');
  }
  return response.json();
}

export async function addLocation(data: Partial<Location>): Promise<Location> {
  const response = await fetch('/api/admin/locations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add location');
  }
  return response.json();
}

export async function updateLocation(id: string, data: Partial<Location>): Promise<Location> {
  const response = await fetch(`/api/admin/locations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update location');
  }
  return response.json();
}

export async function deleteLocation(id: string): Promise<void> {
  const response = await fetch(`/api/admin/locations/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete location');
  }
}