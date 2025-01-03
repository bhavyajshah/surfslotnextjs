'use client'
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { CalendarAccessNotification } from '../dashboard/notifications/calendar-access';
import { SubscriptionNotification } from '../dashboard/notifications/subscription';
import { useSubscription } from '@/hooks/use-subscription';
import { User } from 'next-auth';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocations } from '@/hooks/use-locations';
import { Trash2, Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LocationSearch } from '../dashboard/location-search';
import { SettingsTab } from '../dashboard/tabs/settings-tab';
import { ScheduledTab } from '../dashboard/tabs/scheduled-tab';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { DownArrow, UpArrow } from '../icons';

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

export default function MySurfSlots({ user }: { user: User }): JSX.Element {
    const surfSpots = {
        locationName: "Ericeira",
        title: "Hide surf in Ericeira",
        spots: [
            { name: "Coxos", isChecked: false },
            { name: "Ribeira d'ilhas", isChecked: false },
            { name: "Pedra Branca", isChecked: false },
            { name: "Foz do Lizandro", isChecked: true },
            { name: "Praia dos Pescadores", isChecked: false },
            { name: "Praia do Sul", isChecked: true },
            { name: "Pico do Futuro", isChecked: false },
        ]
    };

    const [activeTab, setActiveTab] = useState("locations");
    const {
        userLocations,
        isLoading,
        isInitialized,
        deleteUserLocation,
        addUserLocation,
        updateLocationSpots,
        updateLocationEnabled,
        loadUserLocations,
    } = useLocations();

    const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({});
    const [hasCalendarAccess, setHasCalendarAccess] = useState(true);
    const { isActive: hasActiveSubscription } = useSubscription();
    const { data: session } = useSession();
    const { toast } = useToast();
    const [loadingLocations, setLoadingLocations] = useState<Record<string, boolean>>({});
    const router = useRouter();

    const checkCalendarAccess = useCallback(() => {
        if (session?.accessToken) {
            const scope = (session as any)?.scope || '';
            const hasCalendarScope = scope.includes('https://www.googleapis.com/auth/calendar');
            setHasCalendarAccess(hasCalendarScope);
        }
    }, [session]);

    useEffect(() => {
        checkCalendarAccess();
    }, [checkCalendarAccess]);

    useEffect(() => {
        if (session?.user?.id && !isInitialized) {
            loadUserLocations();
        }
    }, [session?.user?.id, isInitialized, loadUserLocations]);

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
        setLoadingLocations(prev => ({ ...prev, [locationId]: true }));

        try {
            const locationToUpdate = userLocations.find(loc => loc._id.oid === locationId);
            if (locationToUpdate) {
                const updatedSpots = locationToUpdate.spots.map(spot =>
                    spot.id === spotId ? { ...spot, enabled: checked } : spot
                );
                await updateLocationSpots(locationId, updatedSpots);
                toast({
                    title: 'Success',
                    description: `Spot ${checked ? 'enabled' : 'disabled'} successfully`,
                });
            }
        } catch (error) {
            console.error('Error updating spot:', error);
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
                toast({
                    title: 'Success',
                    description: 'Location added successfully',
                });
            }
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
                {userLocations.map((location: any) => (
                    <Card key={location._id.oid} className="border-t-[5px] border-t-[#264E8A] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border border-black/50">
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe4dca4f0b810e2f143f3440b3b9eb096739f85a164c6e747b41f75ad3f22987?placeholderIfAbsent=true&apiKey=76b2b41bcdee41a2b26006bdf9337ab5"
                            className="object-contain w-full"
                        />
                        <div className="p-6">
                            <h2 className="text-xl font-medium mb-2">{location.locationName}</h2>
                            <div className="flex items-center justify-between mb-4">

                                <div className="flex gap-5 justify-between mt-5 w-full text-base">
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => toggleLocationExpand(location._id.oid)}
                                    >
                                        {expandedLocations[location._id.oid] ? 'Hide' : 'View'} surf spots in {location.locationName}
                                    </span>

                                    {expandedLocations[location._id.oid] ? (
                                        <UpArrow className="inline ml-1" />
                                    ) : (
                                        <DownArrow className="inline ml-1" />
                                    )}


                                </div>
                                <span
                                    className="text-sm text-blue-600 cursor-pointer"
                                    onClick={() => toggleLocationExpand(location._id.oid)}
                                >

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
                                                disabled={loadingLocations[location._id.oid]}
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
                                    onClick={() => handleDeleteLocation(location._id.oid)}
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
        <div className="flex overflow-hidden flex-col pb-24 bg-neutral-50">
            <div className="flex overflow-hidden flex-col w-full bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.15)] max-md:max-w-full">
                <div className="flex overflow-hidden flex-col justify-center items-end px-20 py-2 w-full border border-solid border-[#000000] border-opacity-5 max-md:px-5 max-md:max-w-full">
                    <UserNav user={user} />
                </div>
                <div className="flex flex-col mt-10 ml-28 max-w-full font-medium text-black">
                    <div className="self-start text-[40px] font-medium">my surfslots</div>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-wrap gap-10 items-start mt-10 text-xl max-md:mt-10">
                        <TabsList className="w-full justify-start space-x-8 h-auto bg-white p-0">
                            <TabsTrigger
                                value="locations"
                                className="data-[state=active]:border-[#264E8A] data-[state=active]:shadow-none border-b-4 text-[20px] text-black font-medium border-transparent rounded-none px-0"
                            >
                                locations
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="data-[state=active]:border-[#264E8A] data-[state=active]:shadow-none border-b-4 text-[20px] text-black font-medium border-transparent rounded-none px-0"
                            >
                                surf settings
                            </TabsTrigger>
                            <TabsTrigger
                                value="scheduled"
                                className="data-[state=active]:border-[#264E8A] data-[state=active]:shadow-none border-b-4 text-[20px] text-black font-medium border-transparent rounded-none px-0"
                            >
                                scheduled surfslots
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>


            <div className="gap-9 items-center text-base font-medium text-black min-h-[57px]">
                <div className="mt-8">
                    {!hasCalendarAccess && (
                        <CalendarAccessNotification onRequestAccess={handleCalendarAccess} />
                    )}
                    {!hasActiveSubscription && (
                        <SubscriptionNotification onActivate={handleSubscriptionActivate} />
                    )}
                </div>
            </div>
            <div className="flex flex-col self-center w-full max-w-7xl max-md:mt-10 max-md:max-w-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full gap-10 items-start text-xl max-w-6xl mx-auto">
                <TabsContent value="locations">
                    <div className="flex w-full items-center mt-8 justify-between">
                            <div className="flex items-center gap-4 text-xl">
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                                    <AvatarFallback className='my-auto basis-auto'>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                                <span className='my-auto basis-auto'>{user.name}</span>
                        </div>
                        <LocationSearch onSelect={handleAddLocation} />
                    </div>
                        <div className="shrink-0 mt-2.5 h-px border border-solid border-black border-opacity-40 max-md:max-w-full" />
                        <div className="mt-8">  {renderLocationsContent()} </div>
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
    );
}

