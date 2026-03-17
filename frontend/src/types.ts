
export type Role = "patient" | "doctor";

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
  chronotype: "morning" | "evening" | "intermediate";

  wakeTime: string;
  sleepTime: string;

  nightShift: boolean;
  caffeineIntake: "none" | "low" | "moderate" | "high";

  age: number;
  weight: number;
  height: number;

  gender: "male" | "female" | "other";
  menstrualPhase?: string;

  heartRate?: string;

  diseases: string[];
  medications: string[];
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
  status: "taken" | "missed";
  timestamp: string;
}
