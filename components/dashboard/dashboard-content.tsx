'use client';

import * as React from "react";
import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocations } from "@/hooks/use-locations";
import { signOut } from "next-auth/react";
import { LocationSearch } from "./location-search";
import { ScheduledTab } from "./tabs/scheduled-tab";

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
  const { locations, updateLocation, toggleSpot, deleteLocation } = useLocations();
  const [expandedLocations, setExpandedLocations] = React.useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = React.useState("locations");

  const toggleLocationExpand = (locationId: string) => {
    setExpandedLocations(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
  };

  const handleSpotToggle = async (locationId: string, spotId: string) => {
    try {
      await toggleSpot(locationId, spotId);
    } catch (error) {
      console.error('Error toggling spot:', error);
    }
  };

  const handleLocationToggle = async (locationId: string, active: boolean) => {
    try {
      await updateLocation(locationId, { active });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleLocationDelete = async (locationId: string) => {
    try {
      await deleteLocation(locationId);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <h1 className="text-2xl font-medium">my surfslots</h1>
          <UserNav user={user} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="border-b mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start space-x-8 h-auto bg-transparent p-0">
              <TabsTrigger
                value="locations"
                className="data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-[#264E8A] text-lg border-transparent rounded-none px-0 pb-4"
              >
                locations
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-[#264E8A] text-lg border-transparent rounded-none px-0 pb-4"
              >
                surf settings
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="data-[state=active]:border-primary data-[state=active]:shadow-none border-b-2 border-[#264E8A] text-lg border-transparent rounded-none px-0 pb-4"
              >
                scheduled surfslots
              </TabsTrigger>
            </TabsList>

            <TabsContent value="locations">
              <div className="flex items-center mt-8 justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-lg">{user.name}</span>
                </div>
                <LocationSearch />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.filter(loc => loc.active).map((location) => (
                  <Card key={location.id} className="border-t-[5px] border-t-[#264E8A] border border-black/50">
                    <div className="p-6">
                      <h2 className="text-xl font-medium mb-2">{location.name}</h2>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-sm text-blue-600 cursor-pointer"
                          onClick={() => toggleLocationExpand(location.id)}
                        >
                          {expandedLocations[location.id] ? 'Hide' : 'View'} surf spots in {location.name}
                          {expandedLocations[location.id] ? (
                            <ChevronUp className="inline ml-1" />
                          ) : (
                            <ChevronDown className="inline ml-1" />
                          )}
                        </span>
                      </div>
                      {expandedLocations[location.id] && (
                        <div className="space-y-2 mb-4">
                          {location.spots.map((spot) => (
                            <div key={spot.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={spot.id}
                                checked={spot.active}
                                onCheckedChange={() => handleSpotToggle(location.id, spot.id)}
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
                          onClick={() => handleLocationDelete(location.id)}
                        >
                          <Trash2 className="h-5 w-5 text-black" />
                        </div>
                        <Switch
                          checked={location.active}
                          onCheckedChange={(checked) => handleLocationToggle(location.id, checked)}
                          className="bg-[#ADE2DF]"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-8">
              <div className="text-center text-gray-600 py-12">
                It is still not possible to edit settings for your surf slots like preferred conditions, skill level, tides, availability or favourite periods to surf but we are working on new cool stuff. Your input and help is welcome!
              </div>
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