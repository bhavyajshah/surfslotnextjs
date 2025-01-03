'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionNotificationProps {
  onActivate: () => void;
}

export function SubscriptionNotification({ onActivate }: SubscriptionNotificationProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Alert variant="destructive" className="mb-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
          <div className="ml-0 sm:ml-4 mt-3 sm:mt-0 flex-grow">
            <AlertTitle className="text-lg font-semibold mb-2">Subscription Inactive</AlertTitle>
            <AlertDescription className="text-sm">
              Your subscription is not active. To access your surfslots, please activate your subscription.
            </AlertDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onActivate}
            className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 bg-white text-destructive border-destructive"
          >
            Activate Subscription
          </Button>
        </div>
      </Alert>
    </div>
  );
}

