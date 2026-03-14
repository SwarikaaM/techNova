import React, { useState } from 'react';
import { HealthData } from '../types';
import { Activity, Pill, Clock, User, Weight } from 'lucide-react';

interface HealthInputFormProps {
  onSubmit: (data: HealthData) => void;
  isLoading: boolean;
}

export const HealthInputForm: React.FC<HealthInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<HealthData>({
    chronotype: 'intermediate',
    diseases: [],
    medications: [''],
    diseasePeakTimes: {},
    age: 30,
    weight: 70,
    gender: 'other',
  });

  const [newMed, setNewMed] = useState('');

  const handleDiseaseChange = (disease: string) => {
    setFormData(prev => ({
      ...prev,
      diseases: prev.diseases.includes(disease)
        ? prev.diseases.filter(d => d !== disease)
        : [...prev.diseases, disease]
    }));
  };

  const addMedication = () => {
    if (newMed.trim()) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications.filter(m => m !== ''), newMed.trim()]
      }));
      setNewMed('');
    }
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl border border-blue-100 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chronotype */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Chronotype</span>
          </label>
          <select
            value={formData.chronotype}
            onChange={e => setFormData({ ...formData, chronotype: e.target.value as any })}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50"
          >
            <option value="morning">Morning (Lark)</option>
            <option value="intermediate">Intermediate</option>
            <option value="evening">Evening (Owl)</option>
          </select>
        </div>

        {/* Age & Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
              <User className="h-4 w-4 text-blue-500" />
              <span>Age</span>
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
              <Weight className="h-4 w-4 text-blue-500" />
              <span>Weight (kg)</span>
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={e => setFormData({ ...formData, weight: parseInt(e.target.value) })}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Diseases */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
          <Activity className="h-4 w-4 text-blue-500" />
          <span>Health Conditions</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {['diabetes', 'hypertension', 'asthma', 'insomnia', 'arthritis'].map(disease => (
            <button
              key={disease}
              type="button"
              onClick={() => handleDiseaseChange(disease)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                formData.diseases.includes(disease)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              {disease.charAt(0).toUpperCase() + disease.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
          <Pill className="h-4 w-4 text-blue-500" />
          <span>Current Medications</span>
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMed}
            onChange={e => setNewMed(e.target.value)}
            placeholder="Add medication (e.g. Metformin)"
            className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
          />
          <button
            type="button"
            onClick={addMedication}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.medications.filter(m => m !== '').map((med, idx) => (
            <div key={idx} className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-700">
              <span>{med}</span>
              <button
                type="button"
                onClick={() => removeMedication(idx)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Optimizing Schedule...' : 'Generate AI Optimized Schedule'}
      </button>
    </form>
  );
};
