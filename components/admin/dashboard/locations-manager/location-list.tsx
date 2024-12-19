'use client'

import { useLocations } from "@/hooks/use-locations"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function LocationList() {
    const { locations, isLoading, updateLocation, deleteLocation } = useLocations()

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            {locations.map((location) => (
                <Card key={location.id} className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">{location.name}</h3>
                            <p className="text-sm text-gray-500">{location.city}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Switch
                                checked={location.active}
                                onCheckedChange={(checked) =>
                                    updateLocation(location.id, { active: checked })
                                }
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteLocation(location.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}