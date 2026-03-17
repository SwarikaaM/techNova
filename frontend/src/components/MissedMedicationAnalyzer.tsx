import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Medication {
  name: string;
  time: string;
  diseases?: string[];
}

interface MissedMedicationAnalyzerProps {
  currentMedications: Medication[];
  patientDiseases: string[];
}

// Mock knowledge base for effects and recommendations
const MED_KNOWLEDGE: Record<string, { effects: string; recommendations: string }> = {
  'Metformin': {
    effects: 'Blood sugar levels may rise significantly, leading to fatigue, increased thirst, and blurred vision. Long-term skipping increases risk of diabetic complications.',
    recommendations: 'Resume your normal schedule as soon as possible. Monitor blood glucose more frequently. Do not double the dose to catch up.'
  },
  'Amlodipine': {
    effects: 'Blood pressure may spike (rebound hypertension), increasing strain on the heart and risk of stroke or heart attack.',
    recommendations: 'Take the missed dose if it is within 12 hours of the scheduled time. If longer, skip and take the next dose. Monitor for headaches or dizziness.'
  },
  'Albuterol': {
    effects: 'Increased shortness of breath, wheezing, and higher risk of a severe asthma attack.',
    recommendations: 'Keep your rescue inhaler nearby. Resume scheduled doses immediately. Contact your doctor if breathing becomes difficult.'
  },
  'Atorvastatin': {
    effects: 'Cholesterol levels will begin to rise. While one or two days won\'t cause immediate symptoms, it reduces the long-term protection against heart disease.',
    recommendations: 'Just take your next dose at the usual time. Consistency is key for lipid management.'
  },
  'Lisinopril': {
    effects: 'Increased blood pressure and potential fluid retention. May lead to kidney strain over time.',
    recommendations: 'Take the missed dose as soon as you remember, unless it\'s almost time for your next dose. Do not take two doses at once.'
  },
  'Levothyroxine': {
    effects: 'Symptoms of hypothyroidism like fatigue, cold intolerance, and brain fog may return or worsen.',
    recommendations: 'Take the missed dose as soon as possible. It has a long half-life, so consistency over weeks is more important than a single hour.'
  }
};

export const MissedMedicationAnalyzer: React.FC<MissedMedicationAnalyzerProps> = ({ 
  currentMedications, 
  patientDiseases 
}) => {
  const [selectedMed, setSelectedMed] = useState('');
  const [daysMissed, setDaysMissed] = useState(1);
  const [analysis, setAnalysis] = useState<{ effects: string; recommendations: string } | null>(null);

  const handleAnalyze = () => {
    if (!selectedMed) return;
    
    // Find knowledge or provide generic
    const knowledge = MED_KNOWLEDGE[selectedMed] || {
      effects: 'Skipping medication can lead to a return of symptoms and reduced effectiveness of the overall treatment plan.',
      recommendations: 'Consult your healthcare provider about the best way to resume this specific medication. Generally, do not double doses.'
    };
    
    setAnalysis(knowledge);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-red-50 p-2 rounded-xl">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Missed Med Analyzer</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Select Medicine</label>
          <select 
            value={selectedMed}
            onChange={(e) => {
              setSelectedMed(e.target.value);
              setAnalysis(null);
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-red-500 transition-all"
          >
            <option value="">-- Choose Medication --</option>
            {currentMedications.map((med, idx) => (
              <option key={idx} value={med.name}>{med.name}</option>
            ))}
          </select>
        </div>

        {selectedMed && (
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-center space-x-2 mb-1">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Associated Condition(s)</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {patientDiseases.length > 0 ? (
                patientDiseases.map((disease, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-lg text-xs font-medium text-blue-700 border border-blue-200 shadow-sm">
                    {disease}
                  </span>
                ))
              ) : (
                <span className="text-xs text-blue-500 italic">No specific conditions linked</span>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Days Missed</label>
          <input 
            type="number" 
            min="1" 
            max="30"
            value={daysMissed}
            onChange={(e) => setDaysMissed(parseInt(e.target.value) || 1)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-red-500 transition-all"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!selectedMed}
          className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Analyze Impact</span>
        </button>

        {analysis && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
              <h4 className="flex items-center space-x-2 text-orange-800 font-bold mb-2">
                <AlertCircle className="h-4 w-4" />
                <span>Potential Effects</span>
              </h4>
              <p className="text-sm text-orange-900 leading-relaxed">
                {daysMissed > 3 ? `After ${daysMissed} days: ` : ''}
                {analysis.effects}
              </p>
            </div>

            <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
              <h4 className="flex items-center space-x-2 text-green-800 font-bold mb-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Recommendations</span>
              </h4>
              <p className="text-sm text-green-900 leading-relaxed">
                {analysis.recommendations}
              </p>
            </div>
            
            <p className="text-[10px] text-gray-400 text-center italic">
              Disclaimer: This is an AI-generated analysis. Always consult your doctor for medical advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
