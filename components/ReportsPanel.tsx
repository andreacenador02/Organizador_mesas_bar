import React from 'react';
import { ReportData } from '../types';

interface ReportsPanelProps {
  reportData: ReportData;
}

const ReportCard: React.FC<{ title: string; value: string; unit?: string }> = ({ title, value, unit }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-1 transition-transform border border-gray-700">
        <h3 className="text-lg font-medium text-gray-400">{title}</h3>
        <p className="mt-2 text-4xl font-bold text-violet-400">{value}</p>
        {unit && <p className="text-sm text-gray-500">{unit}</p>}
    </div>
);

const ReportsPanel: React.FC<ReportsPanelProps> = ({ reportData }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Reportes del Día</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard title="Ventas Totales" value={reportData.totalSales} />
        <ReportCard title="Mesa Más Utilizada" value={reportData.mostUsedTable} />
        <ReportCard title="Tiempo Promedio de Ocupación" value={reportData.avgOccupationTimeMinutes} unit="minutos" />
      </div>
    </div>
  );
};

export default ReportsPanel;