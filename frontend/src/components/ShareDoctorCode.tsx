import React, { useState } from 'react';
import { patientService } from '../services/api';
import { Share2, Send, CheckCircle } from 'lucide-react';

export const ShareDoctorCode: React.FC = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleShare = async () => {
    if (!code.trim()) return;
    
    setStatus('loading');
    try {
      await patientService.shareWithDoctor(code);
      setStatus('success');
      setMessage('Schedule shared successfully!');
      setCode('');
    } catch (err) {
      setStatus('error');
      setMessage('Invalid doctor code. Please try again.');
    }
  };

  return (
    <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-xl">
      <div className="flex items-center space-x-2 mb-4">
        <Share2 className="h-5 w-5 text-blue-300" />
        <h3 className="text-lg font-bold">Share With Doctor</h3>
      </div>
      <p className="text-blue-100 text-sm mb-4">
        Enter your doctor's unique code to share your circadian schedule for review.
      </p>
      <div className="flex space-x-2">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Doctor Code"
          className="flex-1 bg-blue-800 border-none rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={handleShare}
          disabled={status === 'loading'}
          className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {status === 'loading' ? (
            <span className="animate-pulse">Sharing...</span>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
      {status === 'success' && (
        <div className="mt-4 flex items-center space-x-2 text-green-400 text-sm font-medium">
          <CheckCircle className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}
      {status === 'error' && (
        <p className="mt-4 text-red-400 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};
