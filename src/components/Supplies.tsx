import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Supply } from '../types';
import { cn } from '../lib/utils';

interface SuppliesProps {
  supplies: Supply[];
  onAdd: () => void;
  onEdit: (supply: Supply) => void;
  onDelete: (id: string) => void;
}

export const Supplies: React.FC<SuppliesProps> = ({ supplies, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSupplies = supplies.filter(s => 
    s.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supplies Inventory</h1>
          <p className="text-slate-500 text-sm">Manage your consumable items and stock levels.</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </header>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search items, categories..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all text-sm font-medium">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Item Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Unit</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSupplies.map((item) => {
                const isLowStock = item.quantity <= item.reorderLevel;
                return (
                  <tr key={item.id} className={cn(
                    "hover:bg-slate-50/50 transition-colors group",
                    isLowStock && "bg-amber-50/30"
                  )}>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.itemName}</div>
                      {isLowStock && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase mt-0.5">
                          <AlertCircle size={10} />
                          Low Stock
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "font-bold",
                        isLowStock ? "text-amber-600" : "text-slate-900"
                      )}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.unit}</td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        isLowStock ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", isLowStock ? "bg-amber-500" : "bg-emerald-500")} />
                        {isLowStock ? "Reorder Soon" : "In Stock"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(item)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(item.id)}
                          className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-900">{filteredSupplies.length}</span> items
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white rounded-lg text-slate-400 disabled:opacity-50 transition-all border border-transparent hover:border-slate-200" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 hover:bg-white rounded-lg text-slate-400 disabled:opacity-50 transition-all border border-transparent hover:border-slate-200" disabled>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
