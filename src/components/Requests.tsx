import React from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock,
  User,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Request, Supply } from '../types';
import { cn, formatDate } from '../lib/utils';

interface RequestsProps {
  requests: Request[];
  supplies: Supply[];
  onSubmit: (request: Partial<Request>) => void;
  onUpdateStatus: (id: string, status: Request['status']) => void;
}

const statusConfig = {
  'Pending': { color: 'bg-amber-100 text-amber-700', icon: Clock },
  'Approved': { color: 'bg-indigo-100 text-indigo-700', icon: CheckCircle2 },
  'Released': { color: 'bg-emerald-100 text-emerald-700', icon: Send },
  'Rejected': { color: 'bg-rose-100 text-rose-700', icon: XCircle },
};

export const Requests: React.FC<RequestsProps> = ({ requests, supplies, onSubmit, onUpdateStatus }) => {
  const [formData, setFormData] = React.useState({
    requestor: '',
    department: '',
    item: '',
    quantity: 1
  });

  const selectedSupply = supplies.find(s => s.itemName === formData.item);
  const isInsufficient = selectedSupply ? selectedSupply.quantity < formData.quantity : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requestor || !formData.item || isInsufficient) return;
    onSubmit(formData);
    setFormData({ requestor: '', department: '', item: '', quantity: 1 });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Issuance Requests</h1>
        <p className="text-slate-500 text-sm">Manage supply requests and approval workflows.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={18} className="text-emerald-500" />
              New Request Slip
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Requestor Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="e.g. John Doe"
                  value={formData.requestor}
                  onChange={(e) => setFormData({...formData, requestor: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="e.g. Operations"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Item Requested</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
                  value={formData.item}
                  onChange={(e) => setFormData({...formData, item: e.target.value})}
                  required
                >
                  <option value="">Choose an item...</option>
                  {supplies.map(s => (
                    <option key={s.id} value={s.itemName}>{s.itemName} ({s.quantity} {s.unit} in stock)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                  required
                />
              </div>

              {isInsufficient && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-600 text-xs">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p>Insufficient stock! Only {selectedSupply?.quantity} {selectedSupply?.unit} available.</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isInsufficient || !formData.requestor || !formData.item}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Request Queue</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {requests.slice().reverse().map((req) => {
                const config = statusConfig[req.status];
                return (
                  <div key={req.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400 uppercase">{req.id}</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1", config.color)}>
                            <config.icon size={10} />
                            {req.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900">{req.item} <span className="text-slate-400 font-normal">x {req.quantity}</span></h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <User size={12} />
                            {req.requestor}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Building2 size={12} />
                            {req.department}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {formatDate(req.date)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => onUpdateStatus(req.id, 'Approved')}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => onUpdateStatus(req.id, 'Rejected')}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === 'Approved' && (
                          <button 
                            onClick={() => onUpdateStatus(req.id, 'Released')}
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm"
                          >
                            Release Stock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {requests.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No requests found in the queue.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
