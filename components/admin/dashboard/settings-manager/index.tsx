import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export function SettingsManager() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email updates about new bookings</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Calendar Sync</p>
              <p className="text-sm text-gray-500">Automatically sync with Google Calendar</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Booking Rules</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Notice Period</label>
            <div className="flex items-center space-x-2">
              <Input type="number" placeholder="2" className="w-20" />
              <span>hours</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Maximum Booking Duration</label>
            <div className="flex items-center space-x-2">
              <Input type="number" placeholder="4" className="w-20" />
              <span>hours</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}