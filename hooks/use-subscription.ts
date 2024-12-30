import { useState, useEffect } from 'react';
  import { useSession } from 'next-auth/react';

  interface Subscription {
    id: string;
    customer: string;
    active: boolean;
  }

  export function useSubscription() {
    const { data: session } = useSession();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchSubscription = async () => {
        if (!session?.user?.id) return;

        try {
          const response = await fetch('/api/user');
          const userData = await response.json();

          if (userData.subscription) {
            setSubscription(userData.subscription);
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubscription();
    }, [session?.user?.id]);

    return {
      subscription,
      isLoading,
      isActive: subscription?.active ?? false
    };
  }