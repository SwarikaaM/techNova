
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});



/* =========================
   AUTH SERVICE
========================= */

export const authService = {

login: async (credentials: any) => {
  try {
    const response = await api.post("/auth/login", credentials);

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);

      const user = {
        id: credentials.email,
        name: credentials.email.split("@")[0],
        email: credentials.email,
        role: response.data.role
      };

      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    console.warn("Backend not found, using mock login");

    const mockUser = {
      id: "mock-id",
      name: credentials.email.split("@")[0],
      email: credentials.email,
      role: credentials.email.includes("doctor") ? "doctor" : "patient",
    };

    const mockData = {
      access_token: "mock-jwt-token",
      user: mockUser
    };

    localStorage.setItem("token", mockData.access_token);
    localStorage.setItem("user", JSON.stringify(mockUser));

    return mockData;
  }
}
,

  register: async (userData: any) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.warn("Backend not found, using mock registration");

      const mockUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");

      const newUser = {
        ...userData,
        id: `mock-${Date.now()}`,
        doctor_code:
          userData.role === "doctor"
            ? `DOC-${Math.floor(1000 + Math.random() * 9000)}`
            : undefined,
      };

      mockUsers.push(newUser);
      localStorage.setItem("mock_users", JSON.stringify(mockUsers));

      return {
        status: "success",
        message: "User registered successfully",
        user: newUser,
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");

    if (!user) return null;

    return JSON.parse(user);
  },
};



/* =========================
   PATIENT SERVICE
========================= */

export const patientService = {

  generateSchedule: async (healthData: any) => {
    try {
      const payload = {
        chronotype: healthData.chronotype,
        wake_time: healthData.wakeTime,
        sleep_time: healthData.sleepTime,
        night_shift: healthData.nightShift,
        caffeine_intake: healthData.caffeineIntake,

        age: healthData.age,
        weight: healthData.weight,
        height: healthData.height,

        gender: healthData.gender,
        menstrual_phase: healthData.menstrualPhase,

        heart_rate: healthData.heartRate,

        diseases: healthData.diseases,
        medications: healthData.medications,
      };

      const response = await api.post("/generate-schedule", payload);

      return response.data;

    } catch (error) {
      console.warn("Backend not found, using mock schedule");

      const schedule = {
        schedule: healthData.medications.map((m: string, i: number) => ({
          name: m,
          time: i % 2 === 0 ? "08:00" : "21:00",
          taken: false
        })),
        lifestyle: [
          "Expose yourself to bright light after waking up.",
          "Avoid caffeine at least 6 hours before sleep.",
          "Maintain a consistent circadian rhythm.",
          "Take medications at the same time every day."
        ]
      };

      return schedule;
    }
  },


  getLatestSchedule: async () => {
    try {
      const saved = localStorage.getItem("currentSchedule");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },


  analyzeDrug: async (data: any) => {
    try {
      const response = await api.post("/analyze", data);
      return response.data;
    } catch (error) {
      console.warn("Analyze service unavailable");

      return {
        drug: data.drug,
        recommended_time: "08:00",
        reason: "Morning dosing improves absorption.",
        side_effects: ["nausea", "headache"],
        interaction_warning: null,
      };
    }
  }

};



/* =========================
   DOCTOR SERVICE
========================= */

export const doctorService = {
  getPatients: async (doctorCode: string) => {
    try {
      const response = await api.get("/doctor/patients", {
        params: {
          doctor_code: doctorCode,
        },
      });

      return response.data;
    } catch (error) {
      console.warn("Backend not found, using mock patient list");

      return [
        {
          id: "1",
          name: "Alice Johnson",
          diseases: ["diabetes", "hypertension"],
          medications: [
            { name: "Metformin", time: "08:00" },
            { name: "Amlodipine", time: "21:00" },
          ],
        },
        {
          id: "2",
          name: "Bob Smith",
          diseases: ["asthma"],
          medications: [
            { name: "Albuterol", time: "07:30" },
            { name: "Fluticasone", time: "20:00" },
          ],
        },
      ];
    }
  },

  modifySchedule: async (
    patientId: string,
    drug: string,
    newTime: string
  ) => {
    try {
      const response = await api.post(
        "/modify-schedule",
        {},
        {
          params: {
            patient_id: patientId,
            drug: drug,
            new_time: newTime,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.warn("Backend not found, using mock modification");

      return {
        status: "success",
      };
    }
  },
};

export default api;

