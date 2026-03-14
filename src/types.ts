export type Role = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  doctor_code?: string;
}

export interface Medication {
  name: string;
  time: string;
  dosage?: string;
  taken?: boolean;
}

export interface HealthData {
  chronotype: 'morning' | 'evening' | 'intermediate';
  diseases: string[];
  medications: string[];
  diseasePeakTimes: Record<string, string>;
  age: number;
  weight: number;
  gender: string;
  cyclePhase?: string;
}

export interface Schedule {
  id: string;
  patientId: string;
  medications: Medication[];
  lifestyleSuggestions: string[];
  createdAt: string;
}

export interface AdherenceLog {
  medicationName: string;
  time: string;
  status: 'taken' | 'missed';
  timestamp: string;
}
