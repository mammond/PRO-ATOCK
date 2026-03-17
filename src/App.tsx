import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Supplies } from './components/Supplies';
import { EquipmentModule } from './components/Equipment';
import { Transactions } from './components/Transactions';
import { Requests } from './components/Requests';
import { DeploymentGuide } from './components/DeploymentGuide';
import { DashboardData, Supply, Equipment, Transaction, Request as IssuanceRequest } from './types';
import { Loader2, Bell, User as UserIcon, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [requests, setRequests] = useState<IssuanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dashRes, suppliesRes, equipRes, txRes, reqRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/supplies'),
        fetch('/api/equipment'),
        fetch('/api/transactions'),
        fetch('/api/requests')
      ]);

      setDashboardData(await dashRes.json());
      setSupplies(await suppliesRes.json());
      setEquipment(await equipRes.json());
      setTransactions(await txRes.json());
      setRequests(await reqRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSupply = async (supply: Partial<Supply>) => {
    await fetch('/api/supplies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supply)
    });
    fetchData();
  };

  const handleDeleteSupply = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    await fetch(`/api/supplies/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleRecordTransaction = async (tx: Partial<Transaction>) => {
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx)
    });
    fetchData();
  };

  const handleSubmitRequest = async (req: Partial<IssuanceRequest>) => {
    await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    fetchData();
  };

  const handleUpdateStatus = async (id: string, status: IssuanceRequest['status']) => {
    await fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={dashboardData} loading={loading} />;
      case 'supplies': return (
        <Supplies 
          supplies={supplies} 
          onAdd={() => handleAddSupply({ itemName: 'New Item', category: 'General', quantity: 0, unit: 'pcs', reorderLevel: 5 })}
          onEdit={(s) => console.log('Edit', s)}
          onDelete={handleDeleteSupply}
        />
      );
      case 'equipment': return (
        <EquipmentModule 
          equipment={equipment}
          onAdd={() => console.log('Add')}
          onEdit={(e) => console.log('Edit', e)}
          onDelete={(id) => console.log('Delete', id)}
        />
      );
      case 'transactions': return (
        <Transactions 
          transactions={transactions} 
          supplies={supplies}
          onRecord={handleRecordTransaction}
        />
      );
      case 'requests': return (
        <Requests 
          requests={requests} 
          supplies={supplies}
          onSubmit={handleSubmitRequest}
          onUpdateStatus={handleUpdateStatus}
        />
      );
      case 'guide': return <DeploymentGuide />;
      default: return <Dashboard data={dashboardData} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-20 lg:ml-64 transition-all duration-300 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Admin User</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Inventory Manager</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                <UserIcon size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="p-8 pt-0 text-center text-slate-400 text-xs">
          <p>© 2024 ProStock Inventory Management System • Built with React & Express</p>
        </footer>
      </main>

      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <p className="text-slate-600 font-medium animate-pulse">Syncing inventory data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
