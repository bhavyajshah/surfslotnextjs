'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionNotificationProps {
  onActivate: () => void;
}

export function SubscriptionNotification({ onActivate }: SubscriptionNotificationProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <Alert variant="destructive" className="mb-4">

          <AlertCircle className="h-4 w-4" />
        <AlertDescription className="ml-2 flex items-center justify-between">
          <span>
            Your subscription is not active. In order to have your surfslots, please activate your subscription.
          </span>
          <Button variant="outline" size="sm" onClick={onActivate} className="ml-4">
            Activate Subscription
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}