import React from 'react';
import { Order, Table, MenuItem } from '../types';

interface TicketModalProps {
    order: Order;
    table: Table;
    menu: MenuItem[];
    onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ order, table, menu, onClose }) => {
    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4">
                    <h2 className="text-2xl font-bold">RestauManage</h2>
                    <p>Mesa: {table.number}</p>
                    <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Hora: {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="py-4 border-b-2 border-dashed border-gray-400">
                    <div className="flex justify-between font-bold">
                        <span>Cant.</span>
                        <span>Descripción</span>
                        <span>Total</span>
                    </div>
                    {order.items.map(item => {
                        const menuItem = menu.find(m => m.id === item.menuItemId);
                        return (
                            <div key={item.menuItemId} className="flex justify-between my-2">
                                <span>{item.quantity}x</span>
                                <span className="flex-grow text-left px-2">{menuItem?.name || 'Producto no encontrado'}</span>
                                <span>{(item.price * item.quantity).toFixed(2)}€</span>
                            </div>
                        )
                    })}
                </div>
                <div className="pt-4 text-right">
                    <p className="text-lg font-bold">TOTAL: {total.toFixed(2)}€</p>
                </div>
                 <div className="mt-6 text-center">
                    <button onClick={onClose} className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default TicketModal;