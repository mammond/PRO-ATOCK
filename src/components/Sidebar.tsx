import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  HardDrive, 
  ArrowLeftRight, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileCode
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'supplies', label: 'Supplies Inventory', icon: Package },
  { id: 'equipment', label: 'Equipment Inventory', icon: HardDrive },
  { id: 'transactions', label: 'Stock In/Out', icon: ArrowLeftRight },
  { id: 'requests', label: 'Issuance Requests', icon: FileText },
  { id: 'guide', label: 'Deployment Guide', icon: FileCode },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 transition-all duration-300 z-50 flex flex-col border-r border-slate-800",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-bold text-white tracking-tight text-lg">ProStock</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
              activeTab === item.id 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "shrink-0",
              activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
            )} />
            {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
          <Settings size={20} />
          {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-colors text-slate-400">
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
