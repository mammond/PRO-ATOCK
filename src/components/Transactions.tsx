import React from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  History,
  Search,
  Calendar,
  Package
} from 'lucide-react';
import { Transaction, Supply } from '../types';
import { cn, formatDate } from '../lib/utils';

interface TransactionsProps {
  transactions: Transaction[];
  supplies: Supply[];
  onRecord: (tx: Partial<Transaction>) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions, supplies, onRecord }) => {
  const [type, setType] = React.useState<'IN' | 'OUT'>('IN');
  const [selectedItem, setSelectedItem] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || quantity <= 0) return;
    onRecord({ type, item: selectedItem, quantity });
    setSelectedItem('');
    setQuantity(1);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Stock Transactions</h1>
        <p className="text-slate-500 text-sm">Record stock movements and maintain history logs.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <History size={18} className="text-emerald-500" />
              New Transaction
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('IN')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                    type === 'IN' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <ArrowUpCircle size={16} />
                  Stock In
                </button>
                <button
                  type="button"
                  onClick={() => setType('OUT')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                    type === 'OUT' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <ArrowDownCircle size={16} />
                  Stock Out
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Select Item</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  required
                >
                  <option value="">Choose an item...</option>
                  {supplies.map(s => (
                    <option key={s.id} value={s.itemName}>{s.itemName} ({s.quantity} {s.unit} available)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
              </div>

              <button 
                type="submit"
                className={cn(
                  "w-full py-3 rounded-xl text-white font-bold transition-all shadow-lg",
                  type === 'IN' 
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
                    : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                )}
              >
                Confirm Transaction
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Transaction History</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter history..." 
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 w-48"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Reference</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Item</th>
                    <th className="px-6 py-4 font-semibold">Quantity</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.slice().reverse().map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">{tx.id}</td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          tx.type === 'IN' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {tx.type === 'IN' ? <ArrowUpCircle size={10} /> : <ArrowDownCircle size={10} />}
                          {tx.type}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">{tx.item}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{tx.quantity}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar size={12} />
                          {formatDate(tx.date)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
