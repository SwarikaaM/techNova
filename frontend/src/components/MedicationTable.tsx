import React from 'react';
import { Medication } from '../types';
import { Clock, CheckCircle2 } from 'lucide-react';

interface MedicationTableProps {
  medications: Medication[];
}

export const MedicationTable: React.FC<MedicationTableProps> = ({ medications }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-sm font-bold text-blue-900 uppercase tracking-wider">Medication</th>
            <th className="px-6 py-4 text-sm font-bold text-blue-900 uppercase tracking-wider">Optimized Time</th>
            <th className="px-6 py-4 text-sm font-bold text-blue-900 uppercase tracking-wider text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {medications.map((med, idx) => (
            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-5">
                <span className="font-bold text-gray-800">{med.name}</span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                  <Clock className="h-4 w-4" />
                  <span>{med.time}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                {med.taken ? (
                  <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Taken</span>
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
                    Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
