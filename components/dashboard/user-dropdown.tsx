'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { User } from 'next-auth';

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const handleManageSubscription = () => {
    // Implement Stripe customer portal redirect
    window.location.href = '/api/stripe/portal';
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: 'https://surfslot.pt' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <img
          src={user.image || ''}
          alt={user.name || ''}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium hidden md:block">
          {user.name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleManageSubscription}>
          Manage subscription
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}