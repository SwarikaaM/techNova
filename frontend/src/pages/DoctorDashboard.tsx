import React, { useState, useEffect } from 'react';
import { doctorService, authService } from '../services/api';
import { DoctorScheduleEditor } from '../components/DoctorScheduleEditor';
import { Users, ClipboardList, Clock, CheckCircle, Edit3, Search, AlertCircle, Key } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await doctorService.getPatients(user?.doctor_code||"");
      setPatients(data);
    } catch (err) {
      setError('Failed to fetch patient data.');
      // Mock data for demo
      setPatients([
        {
          id: '1',
          name: 'Alice Johnson',
          diseases: ['diabetes', 'hypertension'],
          medications: [
            { name: 'Metformin', time: '08:00' },
            { name: 'Amlodipine', time: '21:00' }
          ]
        },
        {
          id: '2',
          name: 'Bob Smith',
          diseases: ['asthma'],
          medications: [
            { name: 'Albuterol', time: '07:30' },
            { name: 'Fluticasone', time: '20:00' }
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };


const handleUpdateSchedule = async (patientId: string, medications: any[]) => {
  try {

    for (const med of medications) {
      await doctorService.modifySchedule(patientId, med.name, med.time);
    }

    setSuccessMsg("Schedule updated and approved successfully!");
    setSelectedPatient(null);

    setTimeout(() => setSuccessMsg(""), 3000);

    fetchPatients();

  } catch (err) {
    setError("Failed to update schedule.");
  }
};


  const handleMedTimeChange = (idx: number, newTime: string) => {
    if (!selectedPatient) return;
    const newMeds = [...selectedPatient.medications];
    newMeds[idx] = { ...newMeds[idx], time: newTime };
    setSelectedPatient({ ...selectedPatient, medications: newMeds });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-blue-950 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-500">Review and manage patient circadian schedules</p>
        </div>
        
        {user?.doctor_code && (
          <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center space-x-4">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">Your Doctor Code</p>
              <p className="text-sm font-black tracking-widest">{user.doctor_code}</p>
            </div>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center space-x-2 font-medium">
          <CheckCircle className="h-5 w-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-2 font-medium">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-blue-900 flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Shared Patients</span>
              </h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold">
                {patients.length}
              </span>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3">
              {patients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedPatient?.id === patient.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                      : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-blue-50 hover:border-blue-100'
                  }`}
                >
                  <p className="font-bold">{patient.name}</p>
                  <div className={`text-xs mt-1 ${selectedPatient?.id === patient.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    {patient.diseases.join(', ')}
                  </div>
                </button>
              ))}
              {patients.length === 0 && !isLoading && (
                <p className="text-center text-gray-400 py-8 italic text-sm">No patients have shared their schedule yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Editor */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <DoctorScheduleEditor 
              patient={selectedPatient}
              onUpdate={handleUpdateSchedule}
              onCancel={() => setSelectedPatient(null)}
              onMedTimeChange={handleMedTimeChange}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div>
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Users className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">No Patient Selected</h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  Select a patient from the list on the left to review and modify their circadian schedule.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
