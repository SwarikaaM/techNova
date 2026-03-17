
import React, { useState } from "react";
import { HealthData } from "../types";
import { Activity, Pill, Clock, User, Weight } from "lucide-react";

interface HealthInputFormProps {
  onSubmit: (data: HealthData) => void;
  isLoading: boolean;
}

export const HealthInputForm: React.FC<HealthInputFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<HealthData>({
    chronotype: "intermediate",
    wakeTime: "07:00",
    sleepTime: "23:00",
    nightShift: false,
    caffeineIntake: "low",
    age: 30,
    weight: 70,
    height: 170,
    gender: "other",
    menstrualPhase: "",
    heartRate: "",
    diseases: [],
    medications: [],
  });

  const [newMed, setNewMed] = useState("");

  const handleDiseaseChange = (disease: string) => {
    setFormData((prev) => ({
      ...prev,
      diseases: prev.diseases.includes(disease)
        ? prev.diseases.filter((d) => d !== disease)
        : [...prev.diseases, disease],
    }));
  };

  const addMedication = () => {
    if (newMed.trim()) {
      setFormData((prev) => ({
        ...prev,
        medications: [...prev.medications, newMed.trim()],
      }));
      setNewMed("");
    }
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-8 rounded-2xl border border-blue-100 shadow-md"
    >
      {/* BASIC INFORMATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Age */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
            <User className="h-4 w-4 text-blue-500" />
            <span>Age</span>
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) =>
              setFormData({ ...formData, age: parseInt(e.target.value) })
            }
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-900">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Menstrual Cycle */}
        {formData.gender === "female" && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-blue-900">
              Menstrual Cycle Phase
            </label>
            <select
              value={formData.menstrualPhase}
              onChange={(e) =>
                setFormData({ ...formData, menstrualPhase: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="">Select Phase</option>
              <option value="follicular">Follicular</option>
              <option value="ovulation">Ovulation</option>
              <option value="luteal">Luteal</option>
              <option value="menstrual">Menstrual</option>
            </select>
          </div>
        )}

        {/* Height */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
            <Weight className="h-4 w-4 text-blue-500" />
            <span>Height (cm)</span>
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) =>
              setFormData({ ...formData, height: parseInt(e.target.value) })
            }
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
            <Weight className="h-4 w-4 text-blue-500" />
            <span>Weight (kg)</span>
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: parseInt(e.target.value) })
            }
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
          />
        </div>
      </div>

      {/* SLEEP DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Wake Time */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-900">
            Wake-up Time
          </label>
          <input
            type="time"
            value={formData.wakeTime}
            onChange={(e) =>
              setFormData({ ...formData, wakeTime: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
          />
        </div>

        {/* Sleep Time */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-900">
            Sleep Time
          </label>
          <input
            type="time"
            value={formData.sleepTime}
            onChange={(e) =>
              setFormData({ ...formData, sleepTime: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
          />
        </div>

        {/* Night Shift */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-900">
            Do you work night shifts?
          </label>
          <select
            value={formData.nightShift ? "yes" : "no"}
            onChange={(e) =>
              setFormData({ ...formData, nightShift: e.target.value === "yes" })
            }
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {/* Caffeine */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-900">
            Daily Caffeine Intake
          </label>
          <select
            value={formData.caffeineIntake}
            onChange={(e) =>
              setFormData({ ...formData, caffeineIntake: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
          >
            <option value="none">None</option>
            <option value="low">1 cup</option>
            <option value="moderate">2-3 cups</option>
            <option value="high">4+ cups</option>
          </select>
        </div>
      </div>

      {/* HEART RATE */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-blue-900">
          Average Resting Heart Rate (optional)
        </label>
        <input
          type="number"
          value={formData.heartRate}
          onChange={(e) =>
            setFormData({ ...formData, heartRate: e.target.value })
          }
          placeholder="Optional - can be fetched from smartwatch in future"
          className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
        />
      </div>

      {/* DISEASES */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-blue-900">
          Health Conditions
        </label>
        <div className="flex flex-wrap gap-3">
          {["diabetes", "hypertension", "asthma", "insomnia", "arthritis"].map(
            (disease) => (
              <button
                key={disease}
                type="button"
                onClick={() => handleDiseaseChange(disease)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  formData.diseases.includes(disease)
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {disease}
              </button>
            )
          )}
        </div>
      </div>

      {/* MEDICATIONS */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
          <Pill className="h-4 w-4 text-blue-500" />
          <span>Current Medications</span>
        </label>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newMed}
            onChange={(e) => setNewMed(e.target.value)}
            placeholder="Add medication"
            className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-50"
          />

          <button
            type="button"
            onClick={addMedication}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.medications.map((med, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg"
            >
              <span>{med}</span>

              <button
                type="button"
                onClick={() => removeMedication(idx)}
                className="text-red-500"
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
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg"
      >
        {isLoading
          ? "Optimizing Schedule..."
          : "Generate AI Optimized Schedule"}
      </button>
    </form>
  );
};
