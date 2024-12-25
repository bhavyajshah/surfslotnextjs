'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationSearch } from "./location-search";
import { ScheduledTab } from "./tabs/scheduled-tab";
import { CalendarAccessNotification } from './notifications/calendar-access';
import { SubscriptionNotification } from './notifications/subscription';
import { SettingsTab } from './tabs/settings-tab';
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { useLocations } from "@/hooks/use-locations";
import { signOut, useSession } from "next-auth/react";
import { Card } from '../ui/card';

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
    const location = userLocations.find(loc => loc._id.oid === actualLocationId || loc.locationId === actualLocationId);
    if (!location) {
      console.error('Location not found:', actualLocationId);
      console.log('Available locations:', userLocations.map(loc => ({ _id: loc._id, locationId: loc.locationId })));
      return;
    }

    const updatedSpots = location.spots.map((spot: any) =>
      spot.id === spotId ? { ...spot, enabled: checked } : spot
    );

    try {
      console.log('Updating spots for location:', actualLocationId);
      console.log('Updated spots:', updatedSpots);
      await updateLocationSpots(actualLocationId, updatedSpots);
    } catch (error) {
      console.error('Error updating spots:', error);
    }
  }, [userLocations, updateLocationSpots]);

  const handleLocationToggle = useCallback(async (locationId: string, enabled: boolean) => {
    try {
      await updateLocationEnabled(locationId, enabled);
    } catch (error) {
      console.error('Error updating location enabled status:', error);
    }
  }, [updateLocationEnabled]);

  useEffect(() => {
    if (session?.accessToken) {
      const scope = (session as any)?.scope || '';
      const hasCalendarScope = scope.includes('https://www.googleapis.com/auth/calendar');
      setHasCalendarAccess(hasCalendarScope);
    }
  }, [session]);

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
                <span
                  className="text-sm text-blue-600 cursor-pointer"
                  onClick={() => toggleLocationExpand(location._id.oid)}
                >
                  {expandedLocations[location._id.oid] ? 'Hide' : 'View'} surf spots in {location.locationName}
                  {expandedLocations[location._id.oid] ? (
                    <ChevronUp className="inline ml-1" />
                  ) : (
                    <ChevronDown className="inline ml-1" />
                  )}
                </span>
              </div>
              {expandedLocations[location._id.oid] && (
                <div className="space-y-2 mb-4">
                  {location.spots.map((spot: any) => (
                    <div key={spot.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={spot.id}
                        checked={spot.enabled}
                        onCheckedChange={(checked) => handleSpotToggle(location._id.oid, spot.id, checked as boolean)}
                        className="border-[#264E8A] data-[state=checked]:bg-[#264E8A] data-[state=checked]:text-white"
                      />
                      <label
                        htmlFor={spot.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {spot.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-end gap-4 mt-4">
                <div
                  className="bg-white rounded-md p-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => deleteUserLocation(location._id.oid)}
                >
                  <Trash2 className="h-5 w-5 text-black" />
                </div>
                <Switch
                  checked={location.enabled}
                  onCheckedChange={(checked) => handleLocationToggle(location._id.oid, checked)}
                  className="bg-[#ADE2DF]"
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
    <div className="min-h-screen bg=[#FAFAFA] flex flex-col">
      <header>
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <UserNav user={user} />
        </div>
      </header>

      <div className="container mx-auto px-4 flex-1">
        <h1 className="text-[32px] font-normal mb-8 text-[#111827]">my surfslots</h1>
        <div className="border-b mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start space-x-8 h-auto bg-transparent p-0 border-b-2">
              <TabsTrigger
                value="locations"
                className="data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-[#264E8A] text-lg border-transparent rounded-none px-0"
              >
                locations
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-[#264E8A] text-lg border-transparent rounded-none px-0"
              >
                surf settings
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-[#264E8A] text-lg border-transparent rounded-none px-0"
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
      </div>
    </div>
  );
}