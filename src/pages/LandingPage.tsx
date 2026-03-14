import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, BrainCircuit, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-8">
            <BrainCircuit className="h-5 w-4" />
            <span>AI-Powered Circadian Medicine</span>
          </div>
          <h1 className="text-5xl md:text-3xl font-black text-blue-950 mb-6 leading-tight">
    The Right Medicine at <br />
    <span className="text-blue-600">The Right Time.</span>
  </h1>
          <p className="text-sm text-gray-800 max-w-xl mx-auto mb-10 leading-relaxed">
            AI ChronoMed optimizes your medication schedule based on your unique circadian rhythm, improving effectiveness and reducing side effects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-4 rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white text-blue-600 border-2 border-blue-100 px-8 py-4 rounded-2xl font-bold text-xs hover:bg-blue-50 transition-all flex items-center justify-center"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-blue-900 mb-4">Circadian Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes your chronotype and disease patterns to find the biological peak times for your treatment.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-blue-900 mb-1">Doctor Supervision</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your AI-generated schedule with your healthcare provider for professional review and adjustment.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-blue-900 mb-4">Adherence Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay on track with real-time logging and reminders tailored to your optimized medication windows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explanation */}
      <section className="py-24">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-lg font-bold text-blue-900 mb-8">What is Circadian Medicine?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Circadian medicine is the study of how our biological clocks influence health and disease. 
            Almost every physiological process in the human body—from blood pressure to immune response—follows a 24-hour cycle.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            By timing medication to coincide with these biological peaks, we can maximize therapeutic benefits 
            while minimizing toxicity and side effects. AI ChronoMed makes this complex science accessible to everyone.
          </p>
        </div>
      </section>
    </div>
  );
};

import { Activity } from 'lucide-react';
