'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from 'next-auth';
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { useLocations } from "@/hooks/use-locations";
import { LocationSearch } from "./location-search";
import { ScheduledTab } from "./tabs/scheduled-tab";
import { SettingsTab } from './tabs/settings-tab';
import { CalendarAccessNotification } from './notifications/calendar-access';
import { SubscriptionNotification } from './notifications/subscription';

function UserNav({ user }: { user: User }) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user.image || ''} alt={user.name || ''} />
          <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem>Manage subscription</DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardContent({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("locations");
  const {
    userLocations,
    setUserLocations,
    isLoading,
    isInitialized,
    deleteUserLocation,
    addUserLocation,
    updateLocationSpots,
    updateLocationEnabled
  } = useLocations();
  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({});
  const [hasCalendarAccess, setHasCalendarAccess] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const { data: session } = useSession();

  const handleSpotToggle = useCallback(async (locationId: string | { oid: string }, spotId: string, checked: boolean) => {
    const actualLocationId = typeof locationId === 'string' ? locationId : locationId.oid;
    const location = userLocations.find(loc =>
      loc._id.oid === actualLocationId || loc.locationId === actualLocationId
    );

    if (!location) {
      console.error('Location not found:', actualLocationId);
      return;
    }

    // Create a new array of spots with the updated enabled state
    const updatedSpots = location.spots.map((spot: any) =>
      spot.id === spotId ? { ...spot, enabled: checked } : spot
    );

    try {
      // Update the UI immediately for better user experience
      setUserLocations(prev =>
        prev.map(loc =>
          (loc._id.oid === actualLocationId || loc.locationId === actualLocationId)
            ? { ...loc, spots: updatedSpots }
            : loc
        )
      );

      // Make the API call
      await updateLocationSpots(actualLocationId, updatedSpots);
    } catch (error) {
      // Revert the UI change if the API call fails
      setUserLocations(prev =>
        prev.map(loc =>
          (loc._id.oid === actualLocationId || loc.locationId === actualLocationId)
            ? { ...loc, spots: location.spots }
            : loc
        )
      );
      console.error('Error updating spots:', error);
    }
  }, [userLocations, updateLocationSpots, setUserLocations]);

  const handleLocationToggle = useCallback(async (locationId: string, enabled: boolean) => {
    try {
      await updateLocationEnabled(locationId, enabled);
    } catch (error) {
      console.error('Error updating location enabled status:', error);
    }
  }, [updateLocationEnabled]);

  const handleDeleteLocation = useCallback(async (locationId: string) => {
    try {
      await deleteUserLocation(locationId);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  }, [deleteUserLocation]); 

  const toggleLocationExpand = useCallback((locationId: string) => {
    setExpandedLocations(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
  }, []);

  const handleCalendarAccess = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to request calendar access:', error);
    }
  }, []);

  const handleSubscriptionActivate = useCallback(async () => {
    try {
      setHasActiveSubscription(true);
    } catch (error) {
      console.error('Failed to activate subscription:', error);
    }
  }, []);

  useEffect(() => {
    if (session?.accessToken) {
      const scope = (session as any)?.scope || '';
      const hasCalendarScope = scope.includes('https://www.googleapis.com/auth/calendar');
      setHasCalendarAccess(hasCalendarScope);
    }
  }, [session]);

  const renderLocationsContent = () => {
    if (isLoading || !isInitialized) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      );
    }

    if (userLocations.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No locations added yet. Click "Add new location" to get started.</p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userLocations.map((location: any) => (
          <Card key={location._id.oid} className="border-t-[5px] border-t-[#264E8A] border border-black/50">
            <div className="p-6">
              <h2 className="text-xl font-medium mb-2">{location.locationName}</h2>
              <div className="flex items-center justify-between mb-4">
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                  onClick={() => toggleLocationExpand(location._id.oid)}
                  aria-expanded={expandedLocations[location._id.oid]}
                  aria-controls={`spots-${location._id.oid}`}
                >
                  {expandedLocations[location._id.oid] ? 'Hide' : 'View'} surf spots in {location.locationName}
                  {expandedLocations[location._id.oid] ? (
                    <ChevronUp className="inline ml-1" />
                  ) : (
                    <ChevronDown className="inline ml-1" />
                  )}
                </button>
              </div>
              {expandedLocations[location._id.oid] && (
                <div
                  id={`spots-${location._id.oid}`}
                  className="space-y-2 mb-4"
                >
                  {location.spots.map((spot: any) => (
                    <div key={spot.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${location._id.oid}-${spot.id}`}
                        checked={spot.enabled}
                        onCheckedChange={(checked) => handleSpotToggle(location._id.oid, spot.id, checked as boolean)}
                        className="border-[#264E8A] data-[state=checked]:bg-[#264E8A] data-[state=checked]:text-white"
                      />
                      <label
                        htmlFor={`${location._id.oid}-${spot.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {spot.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-end gap-4 mt-4">
                <button
                  className="bg-white rounded-md p-2 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => handleDeleteLocation(location._id.oid)}
                  aria-label={`Delete ${location.locationName}`}
                >
                  <Trash2 className="h-5 w-5 text-black" />
                </button>
                <Switch
                  checked={location.enabled}
                  onCheckedChange={(checked) => handleLocationToggle(location._id.oid, checked)}
                  className="bg-[#ADE2DF]"
                  aria-label={`Toggle ${location.locationName}`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to access the dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <UserNav user={user} />
        </div>
      </header>

      <main className="container mx-auto px-4 flex-1">
        <h1 className="text-[32px] font-normal mb-8 text-[#111827]">my surfslots</h1>
        <div className="border-b mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start space-x-8 h-auto bg-transparent p-0 border-b-2">
              <TabsTrigger
                value="locations"
                className="data-[state=active]:border-[#264E8A] data-[state=active]:shadow-none border-b-2 text-lg border-transparent rounded-none px-0"
              >
                locations
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:border-[#264E8A] data-[state=active]:shadow-none border-b-2 text-lg border-transparent rounded-none px-0"
              >
                surf settings
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="data-[state=active]:border-[#264E8A] data-[state=active]:shadow-none border-b-2 text-lg border-transparent rounded-none px-0"
              >
                scheduled surfslots
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              {!hasCalendarAccess && (
                <CalendarAccessNotification onRequestAccess={handleCalendarAccess} />
              )}
              {!hasActiveSubscription && (
                <SubscriptionNotification onActivate={handleSubscriptionActivate} />
              )}
            </div>

            <TabsContent value="locations">
              <div className="flex items-center mt-8 justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-lg">{user.name}</span>
                </div>
                <LocationSearch onSelect={addUserLocation} />
              </div>

              {renderLocationsContent()}
            </TabsContent>

            <TabsContent value="settings" className="mt-8">
              <SettingsTab />
            </TabsContent>

            <TabsContent value="scheduled" className="mt-8">
              <ScheduledTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}