import React, { useState, useMemo } from 'react';
import { Table, Order, TableStatus, MenuItem, MenuCategory } from '../types';
import { TABLE_STATUS_COLORS, TABLE_TEXT_COLORS } from '../constants';
import InteractiveMenu from './InteractiveMenu';
import TicketModal from './TicketModal';

interface TableModalProps {
  table: Table;
  order: Order | null;
  menu: MenuItem[];
  categories: MenuCategory[];
  onClose: () => void;
  onUpdateTableStatus: (tableId: number, status: TableStatus) => void;
  onAddItemToOrder: (tableId: number, menuItemId: number) => void;
  onUpdateOrderItemQuantity: (tableId: number, menuItemId: number, quantity: number) => void;
  onRemoveOrderItem: (tableId: number, menuItemId: number) => void;
  onCheckout: (tableId: number) => void;
}

type ModalView = 'order' | 'menu';

const TableModal: React.FC<TableModalProps> = (props) => {
  const { table, order, menu, onClose, onUpdateTableStatus, onCheckout } = props;
  const [view, setView] = useState<ModalView>('order');
  const [showTicket, setShowTicket] = useState(false);

  const orderTotal = useMemo(() => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [order]);

  const renderActionButtons = () => {
    switch (table.status) {
      case 'free':
        return (
          <>
            <button onClick={() => { onUpdateTableStatus(table.id, 'reserved'); }} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors">Reservar</button>
            <button onClick={() => { onUpdateTableStatus(table.id, 'occupied'); }} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors">Ocupar</button>
          </>
        );
      case 'reserved':
        return (
          <>
            <button onClick={() => { onUpdateTableStatus(table.id, 'occupied'); }} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors">Ocupar</button>
            <button onClick={() => { onUpdateTableStatus(table.id, 'free'); }} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors">Anular Reserva</button>
          </>
        );
      case 'occupied':
          const hasItems = order && order.items.length > 0;
          return (
             <div className="w-full space-y-3">
                 <button onClick={() => setShowTicket(true)} disabled={!hasItems} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Ver Ticket</button>
                 <button onClick={() => onCheckout(table.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors">{hasItems ? 'Cobrar' : 'Liberar Mesa'}</button>
             </div>
          );
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabView: ModalView; label: string }> = ({ tabView, label }) => (
    <button
        onClick={() => setView(tabView)}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${view === tabView ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
    >
        {label}
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
          <div className={`p-6 border-t-8 rounded-t-lg ${TABLE_STATUS_COLORS[table.status]}`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-white">Mesa {table.number}</h2>
                <p className={`font-semibold ${TABLE_TEXT_COLORS[table.status]}`}>{table.status.charAt(0).toUpperCase() + table.status.slice(1)}</p>
                <p className="text-gray-400">Capacidad: {table.capacity} personas</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-3xl leading-none">&times;</button>
            </div>
          </div>
          
          <div className="p-6 flex-grow overflow-y-hidden grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col">
              {table.status === 'occupied' && (
                  <div className="flex border-b border-gray-700">
                      <TabButton tabView="order" label="Pedido Activo" />
                      <TabButton tabView="menu" label="Añadir a Pedido" />
                  </div>
              )}
              <div className="flex-grow bg-gray-700 p-4 rounded-b-lg overflow-y-auto">
                {view === 'order' && table.status === 'occupied' && (
                   order && order.items.length > 0 ? (
                     <ul className="space-y-3">
                       {order.items.map(item => {
                         const menuItem = menu.find(m => m.id === item.menuItemId);
                         if (!menuItem) return null;
                         return (
                           <li key={item.menuItemId} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                             <div>
                               <p className="font-semibold text-white">{menuItem.name}</p>
                               <p className="text-sm text-gray-400">{(item.price * item.quantity).toFixed(2)}€</p>
                             </div>
                             <div className="flex items-center gap-3">
                               <button onClick={() => props.onUpdateOrderItemQuantity(table.id, item.menuItemId, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500">-</button>
                               <span className="w-8 text-center font-bold">{item.quantity}</span>
                               <button onClick={() => props.onUpdateOrderItemQuantity(table.id, item.menuItemId, item.quantity + 1)} className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500">+</button>
                               <button onClick={() => props.onRemoveOrderItem(table.id, item.menuItemId)} className="text-red-500 hover:text-red-400 ml-2 text-xl">&times;</button>
                             </div>
                           </li>
                         );
                       })}
                     </ul>
                   ) : <p className="text-gray-400 italic text-center mt-8">No hay nada en el pedido. Añade algo desde el menú.</p>
                )}
                {view === 'menu' && table.status === 'occupied' && (
                    <InteractiveMenu categories={props.categories} menu={props.menu} onAddItem={(menuItemId) => props.onAddItemToOrder(table.id, menuItemId)} />
                )}
                {table.status !== 'occupied' && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">Esta mesa no está ocupada.</p>
                    </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Acciones</h3>
              <div className="space-y-3">{renderActionButtons()}</div>
              {table.status === 'occupied' && (
                <div className="mt-auto bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-lg">TOTAL</p>
                    <p className="text-white font-bold text-4xl">{orderTotal.toFixed(2)}€</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showTicket && order && (
        <TicketModal order={order} table={table} menu={menu} onClose={() => setShowTicket(false)} />
      )}
    </>
  );
};

export default TableModal;