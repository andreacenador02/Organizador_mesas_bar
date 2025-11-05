import React, { useState, useEffect, useCallback } from 'react';
import { Table, Order, TableStatus, View, Notification, ReportData, MenuCategory, MenuItem, Sale } from './types';
import { INITIAL_TABLES, INITIAL_MENU_CATEGORIES, INITIAL_MENU_ITEMS } from './constants';
import MapView from './components/MapView';
import AdminPanel from './components/AdminPanel';
import ReportsPanel from './components/ReportsPanel';
import Header from './components/Header';
import NotificationToast from './components/NotificationToast';

const App: React.FC = () => {
  const [view, setView] = useState<View>('map');
  
  // Local state management
  const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    });

    const setValue = (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    };
    return [storedValue, setValue];
  };

  const [tables, setTables] = useLocalStorage<Table[]>('restaurant_tables', INITIAL_TABLES);
  const [orders, setOrders] = useLocalStorage<Order[]>('restaurant_orders', []);
  const [menu, setMenu] = useLocalStorage<MenuItem[]>('restaurant_menu', INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useLocalStorage<MenuCategory[]>('restaurant_categories', INITIAL_MENU_CATEGORIES);
  const [occupationHistory, setOccupationHistory] = useLocalStorage<number[]>('restaurant_occupation_history', []);
  const [salesHistory, setSalesHistory] = useLocalStorage<Sale[]>('restaurant_sales_history', []);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newNotification: Notification = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  }, []);

  const updateTable = (updatedTable: Table) => {
    setTables(prev => prev.map(t => t.id === updatedTable.id ? updatedTable : t));
  };
  
  const updateTableStatus = (tableId: number, status: TableStatus) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    setTables(prevTables => prevTables.map(t => {
      if (t.id === tableId) {
        const newTable = { ...t, status };
        if (status === 'occupied') {
          newTable.occupationStartTime = Date.now();
          newTable.usageCount = (newTable.usageCount || 0) + 1;
           const existingOrder = orders.find(o => o.tableId === tableId);
            if (!existingOrder) {
                const newOrder: Order = {
                    id: Date.now(), tableId, items: [], createdAt: new Date().toISOString(),
                };
                setOrders(prevOrders => [...prevOrders, newOrder]);
            }
        // FIX: Removed redundant `status !== 'occupied'` check which is always true in this else branch.
        } else if (t.status === 'occupied' && t.occupationStartTime) {
            const duration = Date.now() - t.occupationStartTime;
            setOccupationHistory(prev => [...prev, duration]);
            newTable.occupationStartTime = null;
        }
        return newTable;
      }
      return t;
    }));
    
    const statusText = { free: 'libre', reserved: 'reservada', occupied: 'ocupada' };
    addNotification(`Mesa ${table.number} ahora está ${statusText[status]}.`, 'info');
  };

  const addItemToOrder = (tableId: number, menuItemId: number) => {
    const menuItem = menu.find(item => item.id === menuItemId);
    if (!menuItem) return;

    setOrders(prevOrders => {
        return prevOrders.map(order => {
            if (order.tableId === tableId) {
                const existingItem = order.items.find(item => item.menuItemId === menuItemId);
                if (existingItem) {
                    return {
                        ...order,
                        items: order.items.map(item => item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + 1 } : item)
                    };
                } else {
                    return {
                        ...order,
                        items: [...order.items, { menuItemId, quantity: 1, price: menuItem.price }]
                    };
                }
            }
            return order;
        });
    });
    addNotification(`${menuItem.name} añadido a la mesa ${tables.find(t=>t.id===tableId)?.number}.`, 'success');
  };

  const updateOrderItemQuantity = (tableId: number, menuItemId: number, quantity: number) => {
    if (quantity < 1) {
        removeOrderItem(tableId, menuItemId);
        return;
    }
    setOrders(prevOrders => prevOrders.map(order => {
        if (order.tableId === tableId) {
            return {
                ...order,
                items: order.items.map(item => item.menuItemId === menuItemId ? { ...item, quantity } : item)
            };
        }
        return order;
    }));
  };

  const removeOrderItem = (tableId: number, menuItemId: number) => {
     setOrders(prevOrders => prevOrders.map(order => {
        if (order.tableId === tableId) {
            return {
                ...order,
                items: order.items.filter(item => item.menuItemId !== menuItemId)
            };
        }
        return order;
    }));
  };
  
  const checkout = (tableId: number) => {
    const order = orders.find(o => o.tableId === tableId);
    const table = tables.find(t => t.id === tableId);
    if (!order || !table) return;

    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (total > 0) {
        const newSale: Sale = {
            id: Date.now(),
            tableId,
            orderId: order.id,
            total,
            items: order.items,
            date: new Date().toISOString(),
        };
        setSalesHistory(prev => [...prev, newSale]);
    }
    
    setOrders(prev => prev.filter(o => o.tableId !== tableId));
    updateTableStatus(tableId, 'free');
    addNotification(`Mesa ${table.number} cobrada por un total de ${total.toFixed(2)}€.`, 'success');
  };

  const calculateReports = (): ReportData => {
    const totalOrdersToday = salesHistory.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).length;
    const totalSalesToday = salesHistory.reduce((sum, sale) => {
        if (new Date(sale.date).toDateString() === new Date().toDateString()) {
            return sum + sale.total;
        }
        return sum;
    }, 0);
    
    const mostUsedTable = tables.length > 0 ? tables.reduce((prev, current) => 
        (prev.usageCount || 0) > (current.usageCount || 0) ? prev : current
    ) : null;
    
    const avgOccupationTime = occupationHistory.length > 0 
        ? (occupationHistory.reduce((a, b) => a + b, 0) / occupationHistory.length) / 1000 / 60
        : 0;

    return {
        totalSales: totalSalesToday.toFixed(2) + '€',
        mostUsedTable: mostUsedTable ? `Mesa ${mostUsedTable.number} (${mostUsedTable.usageCount} veces)` : 'N/A',
        avgOccupationTimeMinutes: avgOccupationTime.toFixed(2),
    };
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header currentView={view} setView={setView} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        {view === 'map' && (
          <MapView
            tables={tables}
            orders={orders}
            menu={menu}
            categories={categories}
            onUpdateTable={updateTable}
            onUpdateTableStatus={updateTableStatus}
            onAddItemToOrder={addItemToOrder}
            onUpdateOrderItemQuantity={updateOrderItemQuantity}
            onRemoveOrderItem={removeOrderItem}
            onCheckout={checkout}
          />
        )}
        {view === 'admin' && (
          <AdminPanel 
            tables={tables} setTables={setTables} 
            menu={menu} setMenu={setMenu}
            categories={categories} setCategories={setCategories}
            addNotification={addNotification} 
          />
        )}
        {view === 'reports' && (
          <ReportsPanel reportData={calculateReports()} />
        )}
      </main>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        {notifications.map(n => (
          <NotificationToast key={n.id} message={n.message} type={n.type} />
        ))}
      </div>
    </div>
  );
};

export default App;
