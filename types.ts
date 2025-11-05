export type TableStatus = 'free' | 'reserved' | 'occupied';

export type Zone = 'bar' | 'dining';

export type View = 'map' | 'admin' | 'reports';

export interface Table {
  id: number;
  number: number;
  zone: Zone;
  capacity: number;
  status: TableStatus;
  position: { x: number; y: number };
  occupationStartTime?: number | null;
  usageCount: number;
}

export interface MenuCategory {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  price: number; // Price at the time of order
}

export interface Order {
  id: number;
  tableId: number;
  items: OrderItem[];
  createdAt: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface Sale {
    id: number;
    orderId: number;
    tableId: number;
    total: number;
    items: OrderItem[];
    date: string;
}

export interface ReportData {
  totalSales: string;
  mostUsedTable: string;
  avgOccupationTimeMinutes: string;
}