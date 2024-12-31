'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from 'next-auth';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
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
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useSubscription } from '@/hooks/use-subscription';

function UserNav({ user }: { user: User }) {
  const handleManageSubscription = () => {
    if (user.email) {
      window.location.href = `https://billing.stripe.com/p/login/test_14kcOOddLaVw6n65kk?prefilled_email=${encodeURIComponent(user.email)}`;
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ''} alt={user.name || ''} />
            <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleManageSubscription}>
          Manage subscription
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface LocationCardProps {
  location: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSpotToggle: (spotId: string, checked: boolean) => void;
  onLocationToggle: (enabled: boolean) => void;
  onDelete: () => void;
  isLoading: boolean;
}

export default function DashboardContent({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("locations");
  const [userLocations, setUserLocations] = useState<any[]>([]);
  const {
    userLocations: initialUserLocations,
    isLoading,
    isInitialized,
    deleteUserLocation,
    addUserLocation,
    updateLocationSpots,
    updateLocationEnabled,
  } = useLocations();

  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({});
  const [hasCalendarAccess, setHasCalendarAccess] = useState(true);
  const { isActive: hasActiveSubscription } = useSubscription();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loadingLocations, setLoadingLocations] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    if (session?.accessToken) {
      const scope = (session as any)?.scope || '';
      const hasCalendarScope = scope.includes('https://www.googleapis.com/auth/calendar');
      setHasCalendarAccess(hasCalendarScope);
    }
  }, [session]);

  useEffect(() => {
    if (isInitialized) {
      setUserLocations(initialUserLocations);
    }
  }, [isInitialized, initialUserLocations]);

  const handleCalendarAccess = useCallback(async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Failed to request calendar access:', error);
    }
  }, [router]);

  const handleSubscriptionActivate = useCallback(async () => {
    if (user.email) {
      window.location.href = `https://buy.stripe.com/test_bIYg0p5sedaNayc7st?prefilled_email=${encodeURIComponent(user.email)}`;
    }
  }, [user.email]);

  const handleSpotToggle = useCallback(async (locationId: string, spotId: string, checked: boolean) => {
    const location = userLocations.find(loc => loc._id === locationId);

    if (!location) return;

    setLoadingLocations(prev => ({ ...prev, [locationId]: true }));

    try {
      const updatedSpots = location.spots.map((spot: any) =>
        spot.id === spotId ? { ...spot, enabled: checked } : spot
      );

      await updateLocationSpots(locationId, updatedSpots);
      toast({
        title: 'Success',
        description: `Spot ${checked ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update spot status',
        variant: 'destructive',
      });
    } finally {
      setLoadingLocations(prev => ({ ...prev, [locationId]: false }));
    }
  }, [userLocations, updateLocationSpots, toast]);

  const handleLocationToggle = useCallback(async (locationId: string, enabled: boolean) => {
    setLoadingLocations(prev => ({ ...prev, [locationId]: true }));
    try {
      await updateLocationEnabled(locationId, enabled);
      toast({
        title: 'Success',
        description: `Location ${enabled ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update location status',
        variant: 'destructive',
      });
    } finally {
      setLoadingLocations(prev => ({ ...prev, [locationId]: false }));
    }
  }, [updateLocationEnabled, toast]);

  const handleDeleteLocation = useCallback(async (locationId: string) => {
    setLoadingLocations(prev => ({ ...prev, [locationId]: true }));
    try {
      await deleteUserLocation(locationId);
      toast({
        title: 'Success',
        description: 'Location deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete location',
        variant: 'destructive',
      });
    } finally {
      setLoadingLocations(prev => ({ ...prev, [locationId]: false }));
    }
  }, [deleteUserLocation, toast]);

  const handleAddLocation = useCallback(async (locationId: string) => {
    setLoadingLocations(prev => ({ ...prev, [locationId]: true }));
    try {
      const newLocation = await addUserLocation(locationId);
      if (newLocation) {
        setUserLocations(prev => [...prev, newLocation]);
      }
      toast({
        title: 'Success',
        description: 'Location added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add location',
        variant: 'destructive',
      });
    } finally {
      setLoadingLocations(prev => ({ ...prev, [locationId]: false }));
    }
  }, [addUserLocation, toast]);

  const toggleLocationExpand = useCallback((locationId: string) => {
    setExpandedLocations(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
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
        {/* {userLocations.map((location: any) => (
          <LocationCard
            key={location._id}
            location={location}
            isExpanded={expandedLocations[location._id]}
            onToggleExpand={() => toggleLocationExpand(location._id)}
            onSpotToggle={(spotId, checked) => handleSpotToggle(location._id, spotId, checked)}
            onLocationToggle={(enabled) => handleLocationToggle(location._id, enabled)}
            onDelete={() => handleDeleteLocation(location._id)}
            isLoading={loadingLocations[location._id]}
          />
        ))} */}



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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className='bg-white'>
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <UserNav user={user} />
        </div>
      </header>

      <main className="container bg-white mx-auto px-4 flex-1">
        <h1 className="text-[32px] font-normal mb-8 text-[#111827]">my surfslots</h1>
        <div className="border-b mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start space-x-8 h-auto bg-white p-0 border-b-2">
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
                <LocationSearch onSelect={handleAddLocation} />
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