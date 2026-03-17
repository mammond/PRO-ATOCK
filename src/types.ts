export interface Supply {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  status: 'Available' | 'In Use' | 'Under Repair' | 'Lost';
  assignedTo: string;
  dateAssigned: string;
}

export interface Transaction {
  id: string;
  type: 'IN' | 'OUT';
  item: string;
  quantity: number;
  date: string;
}

export interface Request {
  id: string;
  requestor: string;
  department: string;
  item: string;
  quantity: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Released' | 'Rejected';
}

export interface DashboardData {
  totalSupplies: number;
  totalEquipment: number;
  lowStockCount: number;
  recentTransactions: Transaction[];
  lowStockItems: Supply[];
}
