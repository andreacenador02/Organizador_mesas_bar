import React, { useState, useRef } from 'react';
import { Table, Order, TableStatus, MenuCategory, MenuItem } from '../types';
import TableComponent from './TableComponent';
import TableModal from './TableModal';

interface MapViewProps {
  tables: Table[];
  orders: Order[];
  menu: MenuItem[];
  categories: MenuCategory[];
  onUpdateTable: (table: Table) => void;
  onUpdateTableStatus: (tableId: number, status: TableStatus) => void;
  onAddItemToOrder: (tableId: number, menuItemId: number) => void;
  onUpdateOrderItemQuantity: (tableId: number, menuItemId: number, quantity: number) => void;
  onRemoveOrderItem: (tableId: number, menuItemId: number) => void;
  onCheckout: (tableId: number) => void;
}

const MapView: React.FC<MapViewProps> = (props) => {
  const { tables, orders, onUpdateTable } = props;
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const tableId = parseInt(e.dataTransfer.getData('tableId'), 10);
    const table = tables.find(t => t.id === tableId);
    if (table && mapRef.current) {
      const mapRect = mapRef.current.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((e.clientX - mapRect.left) / mapRect.width) * 100));
      const y = Math.min(100, Math.max(0, ((e.clientY - mapRect.top) / mapRect.height) * 100));
      onUpdateTable({ ...table, position: { x, y } });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div 
        ref={mapRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative w-full bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-700"
        style={{ height: '75vh' }}
      >
        <div className="absolute top-4 bottom-4 left-1/2 -ml-px w-px bg-gray-600 border-dashed"></div>
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-5xl font-extrabold text-gray-700/50 select-none">BAR</h2>
        </div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2">
            <h2 className="text-5xl font-extrabold text-gray-700/50 select-none">COMEDOR</h2>
        </div>
        
        {tables.map(table => (
          <TableComponent key={table.id} table={table} onClick={() => setSelectedTable(table)} />
        ))}
      </div>
      {selectedTable && (
        <TableModal
          table={selectedTable}
          order={orders.find(o => o.tableId === selectedTable.id) || null}
          onClose={() => setSelectedTable(null)}
          {...props}
        />
      )}
    </>
  );
};

export default MapView;