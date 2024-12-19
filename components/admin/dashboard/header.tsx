import { UserNav } from './user-nav';
import { ModeToggle } from '@/components/ui/mode-toggle';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}