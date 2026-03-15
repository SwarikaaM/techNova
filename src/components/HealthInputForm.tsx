import React, { useState } from 'react';
import { HealthData } from '../types';
import { Activity, Pill, Clock, User, Weight, Heart } from 'lucide-react';

interface HealthInputFormProps {
  onSubmit: (data: HealthData) => void;
  isLoading: boolean;
}

export const HealthInputForm: React.FC<HealthInputFormProps> = ({ onSubmit, isLoading }) => {

  const [formData, setFormData] = useState<any>({
    chronotype: 'intermediate',
    diseases: [],
    medications: [''],
    diseasePeakTimes: {},
    age: '',
    weight: '',
    height: '',
    heartRate: '',
    gender: 'other',
    menstruation: '',
    wakeUpTime: '',
    sleepTime: '',
    nightShift: 'no',
    caffeine: 'low'
  });

  const [newMed, setNewMed] = useState('');

  const handleDiseaseChange = (disease: string) => {
    setFormData((prev: any) => ({
      ...prev,
      diseases: prev.diseases.includes(disease)
        ? prev.diseases.filter((d: string) => d !== disease)
        : [...prev.diseases, disease]
    }));
  };

  const addMedication = () => {
    if (newMed.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        medications: [...prev.medications.filter((m: string) => m !== ''), newMed.trim()]
      }));
      setNewMed('');
    }
  };

  const removeMedication = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      medications: prev.medications.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (

<form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl border border-blue-100 shadow-md">

{/* Chronotype */}
<div className="space-y-2">
<label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
<Clock className="h-4 w-4 text-blue-500" />
<span>Chronotype</span>
</label>

<select
value={formData.chronotype}
onChange={e => setFormData({ ...formData, chronotype: e.target.value })}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
> 
<optionvalue="morning">Morning (Lark)</option>
<option value="intermediate">Intermediate</option>
<option value="evening">Evening (Owl)</option>
</select>
</div>


{/* Age Weight Height Heart Rate */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

{/* Age */}

<div className="space-y-2">
<label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
<User className="h-4 w-4 text-blue-500"/>
<span>Age</span>
</label>

<input
type="number"
min="0"
max="120"
placeholder="Enter age"
value={formData.age}
onChange={e=>{
const val = Number(e.target.value)
if(val<=120){
setFormData({...formData,age:val})
}
}}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
/>
</div>


{/* Weight */}

<div className="space-y-2">
<label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
<Weight className="h-4 w-4 text-blue-500"/>
<span>Weight (kg)</span>
</label>

<input
type="number"
min="1"
max="300"
placeholder="Enter weight"
value={formData.weight}
onChange={e=>setFormData({...formData,weight:Number(e.target.value)})}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
/>
</div>


{/* Height */}

<div className="space-y-2">
<label className="text-sm font-semibold text-blue-900">Height (cm)</label>

<input
type="number"
min="50"
max="250"
placeholder="Enter height"
value={formData.height}
onChange={e=>setFormData({...formData,height:Number(e.target.value)})}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
/>
</div>


{/* Heart Rate */}

<div className="space-y-2">
<label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
<Heart className="h-4 w-4 text-blue-500"/>
<span>Heart Rate (bpm)</span>
</label>

<input
type="number"
min="30"
max="200"
placeholder="Enter heart rate"
value={formData.heartRate}
onChange={e=>setFormData({...formData,heartRate:Number(e.target.value)})}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
/>
</div>

</div>


{/* Gender */}

<div className="space-y-2">
<label className="text-sm font-semibold text-blue-900">Gender</label>

<select
value={formData.gender}
onChange={e=>setFormData({...formData,gender:e.target.value})}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
> 
<optionvalue="male">Male</option>
<option value="female">Female</option>
<option value="other">Other</option>
</select>
</div>


{/* Menstruation (only female) */}

{formData.gender === "female" && (

<div className="space-y-2">
<label className="text-sm font-semibold text-blue-900">
Menstrual Cycle Details
</label>

<input
type="text"
placeholder="Example: Day 5 / PMS phase"
value={formData.menstruation}
onChange={e=>setFormData({...formData,menstruation:e.target.value})}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
/>
</div>

)}


{/* Sleep Schedule */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<div className="space-y-2">
<label className="text-sm font-semibold text-blue-900">Wake Up Time</label>

<input
type="time"
value={formData.wakeUpTime}
onChange={e=>setFormData({...formData,wakeUpTime:e.target.value})}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
/>
</div>

<div className="space-y-2">
<label className="text-sm font-semibold text-blue-900">Sleep Time</label>

<input
type="time"
value={formData.sleepTime}
onChange={e=>setFormData({...formData,sleepTime:e.target.value})}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
/>
</div>

</div>


{/* Night Shift + Caffeine */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<div className="space-y-2">
<label className="text-sm font-semibold text-blue-900">Night Shift</label>

<select
value={formData.nightShift}
onChange={e=>setFormData({...formData,nightShift:e.target.value})}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
> 
<optionvalue="no">No</option>
<option value="yes">Yes</option>
</select>

</div>


<div className="space-y-2">
<label className="text-sm font-semibold text-blue-900">Caffeine Intake</label>

<select
value={formData.caffeine}
onChange={e=>setFormData({...formData,caffeine:e.target.value})}
className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
> 
<optionvalue="none">None</option>
<option value="low">Low (1 cup)</option>
<option value="moderate">Moderate (2 cups)</option>
<option value="high">High (3+ cups)</option>
</select>

</div>

</div>


{/* Diseases */}

<div className="space-y-3">
<label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
<Activity className="h-4 w-4 text-blue-500"/>
<span>Health Conditions</span>
</label>

<div className="flex flex-wrap gap-3">

{['diabetes','hypertension','asthma','insomnia','arthritis'].map(disease=>(
<button
key={disease}
type="button"
onClick={()=>handleDiseaseChange(disease)}
className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
formData.diseases.includes(disease)
?'bg-blue-600 text-white shadow-md'
:'bg-blue-50 text-blue-700 hover:bg-blue-100'
}`}
> 
{disease.charAt(0).toUpperCase()+disease.slice(1)}
</button>
))}

</div>
</div>


{/* Medications */}

<div className="space-y-3">

<label className="flex items-center space-x-2 text-sm font-semibold text-blue-900">
<Pill className="h-4 w-4 text-blue-500"/>
<span>Current Medications</span>
</label>

<div className="flex space-x-2">

<input
type="text"
value={newMed}
onChange={e=>setNewMed(e.target.value)}
placeholder="Add medication (e.g. Metformin)"
className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50"
/>

<button
type="button"
onClick={addMedication}
className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
> 
Add
</button>

</div>


<div className="flex flex-wrap gap-2 mt-2">

{formData.medications.filter((m:string)=>m!=='').map((med:string,idx:number)=>(
<div key={idx} className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-700">

<span>{med}</span>

<button
type="button"
onClick={()=>removeMedication(idx)}
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
className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
> 
{isLoading? 'Optimizing Schedule...' : 'Generate AI Optimized Schedule'}
</button>

</form>

);
};
