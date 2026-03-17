import React from 'react';
import { Medication } from '../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface AdherenceTrackerProps {
  medications: Medication[];
  onToggle: (medName: string) => void;
}

export const AdherenceTracker: React.FC<AdherenceTrackerProps> = ({ medications, onToggle }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-md">
      <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center space-x-2">
        <span>Today's Adherence</span>
      </h3>
      <div className="space-y-3">
        {medications.map((med, idx) => (
          <div
            key={idx}
            onClick={() => onToggle(med.name)}
            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
              med.taken
                ? 'bg-green-50 border-green-100 text-green-800'
                : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-blue-50 hover:border-blue-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              {med.taken ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-gray-300" />
              )}
              <div>
                <p className="font-semibold">{med.name}</p>
                <div className="flex items-center space-x-1 text-xs opacity-70">
                  <Clock className="h-3 w-3" />
                  <span>Scheduled for {med.time}</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
              med.taken ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
            }`}>
              {med.taken ? 'Taken' : 'Pending'}
            </span>
          </div>
        ))}
        {medications.length === 0 && (
          <p className="text-center text-gray-400 py-4 italic">No medications scheduled for today.</p>
        )}
      </div>
    </div>
  );
};
