import React from 'react';
import { ClipboardList, Clock, Edit3, CheckCircle } from 'lucide-react';

interface DoctorScheduleEditorProps {
  patient: any;
  onUpdate: (patientId: string, medications: any[]) => void;
  onCancel: () => void;
  onMedTimeChange: (idx: number, newTime: string) => void;
}

export const DoctorScheduleEditor: React.FC<DoctorScheduleEditorProps> = ({ 
  patient, 
  onUpdate, 
  onCancel,
  onMedTimeChange
}) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">{patient.name}'s Schedule</h2>
          <p className="text-gray-500">Review and adjust medication timing</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-2xl">
          <ClipboardList className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patient.medications.map((med: any, idx: number) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">{med.name}</span>
                <Edit3 className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <input
                  type="time"
                  value={med.time}
                  onChange={(e) => onMedTimeChange(idx, e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(patient.id, patient.medications)}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center space-x-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Approve & Save Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
