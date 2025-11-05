import React from 'react';
import { Table } from '../types';
import { TABLE_STATUS_COLORS, TABLE_TEXT_COLORS } from '../constants';

interface TableProps {
  table: Table;
  onClick: () => void;
}

const TableComponent: React.FC<TableProps> = ({ table, onClick }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('tableId', table.id.toString());
  };

  const colorClasses = TABLE_STATUS_COLORS[table.status];
  const textColorClasses = TABLE_TEXT_COLORS[table.status];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className={`absolute flex flex-col items-center justify-center w-20 h-20 rounded-full shadow-lg cursor-pointer transform hover:scale-110 transition-transform border-2 bg-gray-800 ${colorClasses}`}
      style={{ left: `${table.position.x}%`, top: `${table.position.y}%`, transform: 'translate(-50%, -50%)' }}
      aria-label={`Mesa ${table.number}, estado: ${table.status}`}
    >
      <span className={`font-bold text-sm ${textColorClasses}`}>Mesa</span>
      <span className={`font-bold text-3xl ${textColorClasses}`}>{table.number}</span>
    </div>
  );
};

export default TableComponent;