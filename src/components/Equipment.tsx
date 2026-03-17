import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Wrench,
  XCircle
} from 'lucide-react';
import { Equipment } from '../types';
import { cn } from '../lib/utils';

interface EquipmentProps {
  equipment: Equipment[];
  onAdd: () => void;
  onEdit: (equip: Equipment) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  'Available': { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, dot: 'bg-emerald-500' },
  'In Use': { color: 'bg-indigo-100 text-indigo-700', icon: Clock, dot: 'bg-indigo-500' },
  'Under Repair': { color: 'bg-amber-100 text-amber-700', icon: Wrench, dot: 'bg-amber-500' },
  'Lost': { color: 'bg-rose-100 text-rose-700', icon: XCircle, dot: 'bg-rose-500' },
};

export const EquipmentModule: React.FC<EquipmentProps> = ({ equipment, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = equipment.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Equipment Inventory</h1>
          <p className="text-slate-500 text-sm">Track your assets, their status, and assignments.</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          Register Equipment
        </button>
      </header>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search equipment, category, user..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const config = statusConfig[item.status];
          return (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5", config.color)}>
                    <config.icon size={12} />
                    {item.status}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{item.category}</p>
                
                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <User size={16} className="text-slate-400" />
                    <span>{item.assignedTo || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar size={16} className="text-slate-400" />
                    <span>{item.dateAssigned ? new Date(item.dateAssigned).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{item.id}</span>
                <div className={cn("w-2 h-2 rounded-full animate-pulse", config.dot)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
