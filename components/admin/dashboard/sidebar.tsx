import { MapPin, Settings, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart }
  ];

  return (
    <div className="w-64 bg-white border-r">
      <div className="p-6">
        <h2 className="text-xl font-bold">surfslot</h2>
      </div>
      <nav className="space-y-1 px-3">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={cn(
              "flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
              activeSection === id
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon className="mr-3 h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}