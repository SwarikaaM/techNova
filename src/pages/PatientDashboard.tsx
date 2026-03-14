import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HealthInputForm } from '../components/HealthInputForm';
import { patientService, authService } from '../services/api';
import { BrainCircuit, Info, ArrowRight } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasExistingSchedule, setHasExistingSchedule] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    checkExistingSchedule();
  }, []);

  const checkExistingSchedule = async () => {
    const schedule = await patientService.getLatestSchedule();
    if (schedule) {
      setHasExistingSchedule(true);
    }
  };

  const handleGenerateSchedule = async (healthData: any) => {
    setIsLoading(true);
    setError('');
    try {
      const schedule = await patientService.generateSchedule(healthData);
      localStorage.setItem('currentSchedule', JSON.stringify(schedule));
      navigate('/patient/schedule');
    } catch (err) {
      setError('Unable to retrieve schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
          <BrainCircuit className="h-4 w-4" />
          <span>Personalized Optimization</span>
        </div>
        <h1 className="text-xl font-black text-blue-950 mb-4">Health Profile</h1>
        <p className="text-gray-600 max-w-sm mx-auto">
          Provide your health details below. Our AI will analyze your biological rhythms to create the most effective medication schedule for you.
        </p>
        
        {hasExistingSchedule && (
          <button
            onClick={() => navigate('/patient/schedule')}
            className="mt-2 inline-flex items-center space-x-1 bg-blue-600 text-white px-6 py-3 rounded-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <span>View Current Schedule</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <HealthInputForm onSubmit={handleGenerateSchedule} isLoading={isLoading} />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-1">Why this matters?</h3>
          <p className="text-sm text-blue-800 opacity-80 leading-relaxed">
            Medications like blood pressure pills or asthma inhalers can be up to 5x more effective when taken at specific biological peak times.
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2">Data Privacy</h3>
          <p className="text-sm text-blue-800 opacity-80 leading-relaxed">
            Your health data is encrypted and only used to generate your schedule. You control who sees your information.
          </p>
        </div>
      </div>
    </div>
  );
};
