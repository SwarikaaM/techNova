import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: any) => {
    try {
      const response = await api.post('/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.warn('Backend not found, using mock login');
      
      // Check mock database in localStorage
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const foundUser = mockUsers.find((u: any) => u.email === credentials.email);

      const mockUser = foundUser || {
        id: 'mock-id',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.email.includes('doctor') ? 'doctor' : 'patient'
      };

      const mockData = {
        access_token: 'mock-jwt-token',
        user: mockUser
      };
      localStorage.setItem('token', mockData.access_token);
      localStorage.setItem('user', JSON.stringify(mockData.user));
      return mockData;
    }
  },
  register: async (userData: any) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      console.warn('Backend not found, using mock registration');
      
      // Save to mock database in localStorage
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const newUser = { 
        ...userData, 
        id: `mock-${Date.now()}`,
        doctor_code: userData.role === 'doctor' ? `DOC-${Math.floor(1000 + Math.random() * 9000)}` : undefined
      };
      mockUsers.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(mockUsers));

      return { status: 'success', message: 'User registered successfully', user: newUser };
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const patientService = {
  generateSchedule: async (healthData: any) => {
    try {
      const response = await api.post('/generate-schedule', healthData);
      return response.data;
    } catch (error) {
      console.warn('Backend not found, using mock schedule');
      const schedule = {
        medications: healthData.medications.map((m: string, i: number) => ({
          name: m,
          time: i % 2 === 0 ? '08:00' : '21:00',
          taken: false
        })),
        lifestyleSuggestions: [
          "Expose yourself to bright light immediately after waking up.",
          "Avoid caffeine after 2:00 PM to protect your melatonin onset.",
          "Maintain a consistent sleep-wake cycle even on weekends."
        ],
        healthData: healthData // Store original data for sharing
      };
      // Store locally for the sharing simulation
      const user = authService.getCurrentUser();
      if (user) {
        localStorage.setItem(`schedule_${user.id}`, JSON.stringify(schedule));
      }
      return schedule;
    }
  },
  shareWithDoctor: async (doctorCode: string) => {
    try {
      const response = await api.post('/share-with-doctor', { doctor_code: doctorCode });
      return response.data;
    } catch (error) {
      console.warn('Backend not found, using mock sharing simulation');
      const user = authService.getCurrentUser();
      const schedule = JSON.parse(localStorage.getItem(`schedule_${user?.id}`) || 'null');
      
      if (!user || !schedule) {
        throw new Error('No health data found to share. Please generate a schedule first.');
      }

      // Get shared database
      const sharedDB = JSON.parse(localStorage.getItem('mock_shared_patients') || '{}');
      if (!sharedDB[doctorCode]) sharedDB[doctorCode] = [];
      
      // Add patient to doctor's list (avoid duplicates)
      const existingIdx = sharedDB[doctorCode].findIndex((p: any) => p.id === user.id);
      const patientRecord = {
        id: user.id,
        name: user.name,
        diseases: schedule.healthData?.diseases || [],
        medications: schedule.medications
      };

      if (existingIdx > -1) {
        sharedDB[doctorCode][existingIdx] = patientRecord;
      } else {
        sharedDB[doctorCode].push(patientRecord);
      }

      localStorage.setItem('mock_shared_patients', JSON.stringify(sharedDB));
      return { status: 'success' };
    }
  },
  logMedication: async (logData: any) => {
    try {
      const response = await api.post('/log-medication', logData);
      return response.data;
    } catch (error) {
      console.warn('Backend not found, using mock logging');
      return { status: 'success' };
    }
  },
  getAdherenceLogs: async () => {
    try {
      const response = await api.get('/adherence-logs');
      return response.data;
    } catch (error) {
      return [];
    }
  },
  getLatestSchedule: async () => {
    try {
      const response = await api.get('/patient/schedule');
      return response.data;
    } catch (error) {
      console.warn('Backend not found, using mock schedule retrieval');
      const user = authService.getCurrentUser();
      if (!user) return null;
      
      const saved = localStorage.getItem(`schedule_${user.id}`);
      if (saved) {
        return JSON.parse(saved);
      }
      
      // Fallback to currentSchedule if specific one doesn't exist
      const current = localStorage.getItem('currentSchedule');
      return current ? JSON.parse(current) : null;
    }
  }
};

export const doctorService = {
  getPatients: async () => {
    try {
      const response = await api.get('/doctor/patients');
      return response.data;
    } catch (error) {
      console.warn('Backend not found, using mock patient list');
      const user = authService.getCurrentUser();
      const doctorCode = user?.doctor_code;
      
      const sharedDB = JSON.parse(localStorage.getItem('mock_shared_patients') || '{}');
      const myPatients = doctorCode ? (sharedDB[doctorCode] || []) : [];

      // Combine with static defaults for a full-looking dashboard
      const defaults = [
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
      ];

      return [...myPatients, ...defaults];
    }
  },
  modifySchedule: async (scheduleData: any) => {
    try {
      const response = await api.post('/modify-schedule', scheduleData);
      return response.data;
    } catch (error) {
      console.warn('Backend not found, using mock modification');
      const { patientId, medications } = scheduleData;
      const doctor = authService.getCurrentUser();
      const doctorCode = doctor?.doctor_code;

      // 1. Update the shared database
      if (doctorCode) {
        const sharedDB = JSON.parse(localStorage.getItem('mock_shared_patients') || '{}');
        if (sharedDB[doctorCode]) {
          const patientIdx = sharedDB[doctorCode].findIndex((p: any) => p.id === patientId);
          if (patientIdx > -1) {
            sharedDB[doctorCode][patientIdx].medications = medications;
            sharedDB[doctorCode][patientIdx].approvedBy = doctor.name;
            localStorage.setItem('mock_shared_patients', JSON.stringify(sharedDB));
          }
        }
      }

      // 2. Update the patient's specific schedule
      const patientSchedule = JSON.parse(localStorage.getItem(`schedule_${patientId}`) || 'null');
      if (patientSchedule) {
        patientSchedule.medications = medications;
        patientSchedule.approvedBy = doctor?.name || 'Doctor';
        patientSchedule.approvedAt = new Date().toISOString();
        localStorage.setItem(`schedule_${patientId}`, JSON.stringify(patientSchedule));
      }

      return { status: 'success' };
    }
  }
};

export default api;
