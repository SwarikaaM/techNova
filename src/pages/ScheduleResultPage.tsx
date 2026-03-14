import React, { useState, useEffect } from 'react';
import { MedicationTable } from '../components/MedicationTable';
import { CircadianChart } from '../components/CircadianChart';
import { AdherenceTracker } from '../components/AdherenceTracker';
import { ShareDoctorCode } from '../components/ShareDoctorCode';
import { MissedMedicationAnalyzer } from '../components/MissedMedicationAnalyzer';
import { patientService, authService } from '../services/api';
import { Calendar, Lightbulb, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ScheduleResultPage: React.FC = () => {
  const [schedule, setSchedule] = useState<any>(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    const data = await patientService.getLatestSchedule();
    if (data) {
      setSchedule(data);
    }
  };

  const handleToggleMed = (medName: string) => {
    if (!schedule) return;
    const newMeds = schedule.medications.map((m: any) => 
      m.name === medName ? { ...m, taken: !m.taken } : m
    );
    const newSchedule = { ...schedule, medications: newMeds };
    setSchedule(newSchedule);
    
    // Update local storage
    localStorage.setItem('currentSchedule', JSON.stringify(newSchedule));
    if (user) {
      localStorage.setItem(`schedule_${user.id}`, JSON.stringify(newSchedule));
    }
  };

  if (!schedule) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your optimized schedule...</p>
        </div>
      </div>
    );
  }

  const medTimes = schedule.medications.map((m: any) => m.time);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Schedule & Chart */}
        <div className="flex-1 space-y-8">
          <div className="bg-white p-8 rounded-xl border border-blue-100 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-xl font-black text-blue-950">Your AI Schedule</h1>
                <p className="text-gray-500">Optimized for your circadian rhythm</p>
                
                {schedule.approvedBy && (
                  <div className="mt-3 inline-flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-bold">Approved by {schedule.approvedBy}</span>
                  </div>
                )}
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <MedicationTable medications={schedule.medications} />
          </div>

          <CircadianChart medicationTimes={medTimes} />

          <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Lifestyle Suggestions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.lifestyleSuggestions.map((suggestion: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="bg-blue-200 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-blue-900 font-medium leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Adherence & Sharing */}
        <div className="lg:w-30 space-y-4">
          <AdherenceTracker 
            medications={schedule.medications} 
            onToggle={handleToggleMed} 
          />
          <MissedMedicationAnalyzer 
            currentMedications={schedule.medications}
            patientDiseases={schedule.healthData?.diseases || []}
          />
          <ShareDoctorCode />
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-2 text-sm">Need Help?</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              If you experience any unusual symptoms after starting this schedule, please contact your doctor immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
