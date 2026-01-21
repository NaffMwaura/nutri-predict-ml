import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Droplets, Sun, Stethoscope,  
  FileText, LogOut, RefreshCcw, Activity, Scale, Pizza, Beef, Microscope
} from 'lucide-react';
import type { PredictionRequest, PredictionResponse } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

interface ClinicalFormData {
  age: number;
  gender: 1 | 2;
  iron_intake: number;
  vit_d_intake: number;
  weight: number;
  height: number;
  muac: number;
  proteins: number;
  carbs: number;
  zinc: number;
  vitA: number;
  vitE: number;
  vitC: number;
  vitK: number;
  [key: string]: number; // Allow string indexing for the Vitamin mapping loop
}


const Dashboard = ({ onLogout }: DashboardProps) => {
  // Main form state including required backend fields and UI-only clinical fields
const [formData, setFormData] = useState<ClinicalFormData>({
    age: 25,
    gender: 1,
    iron_intake: 8.0,
    vit_d_intake: 10.0,
    weight: 70,
    height: 170,
    muac: 25,
    proteins: 50,
    carbs: 250,
    zinc: 11,
    vitA: 900,
    vitE: 15,
    vitC: 90,
    vitK: 120
  });

  const [bmi, setBmi] = useState(0);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-calculate BMI locally for the UI
  useEffect(() => {
    if (formData.height > 0) {
      const heightInMeters = formData.height / 100;
      const calculatedBmi = formData.weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBmi.toFixed(1)));
    }
  }, [formData.weight, formData.height]);

  const RENDER_API_URL = "https://nutri-predict-ml.onrender.com/predict"; 

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Stripping data to only what the current backend model expects
      const payload: PredictionRequest = {
        age: formData.age,
        gender: formData.gender,
        iron_intake: formData.iron_intake,
        vit_d_intake: formData.vit_d_intake
      };
      const response = await axios.post(RENDER_API_URL, payload);
      setResult(response.data);
    } catch (err) {
      setError('Connection failed. Ensure the backend is live.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 glass-card px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2">
          <Activity className="text-medical-600 shrink-0" />
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">Clinical Decision Support System</h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-medium">
          <LogOut size={18} /> Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Section */}
        <section className="lg:col-span-5 space-y-6">
          <form onSubmit={handlePredict} className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-4">
              <User className="text-medical-600" /> Patient Assessment
            </h2>

            {/* Core & Physical Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Age (Years)</label>
                <input type="number" className="w-full bg-white/50 border p-2 rounded-lg" value={formData.age} onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Gender</label>
                <select className="w-full bg-white/50 border p-2 rounded-lg" value={formData.gender} onChange={(e) => setFormData({...formData, gender: Number(e.target.value) as 1 | 2})}>
                  <option value={1}>Male</option>
                  <option value={2}>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Weight (kg)</label>
                <input type="number" className="w-full bg-white/50 border p-2 rounded-lg" value={formData.weight} onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Height (cm)</label>
                <input type="number" className="w-full bg-white/50 border p-2 rounded-lg" value={formData.height} onChange={(e) => setFormData({...formData, height: Number(e.target.value)})} />
              </div>
            </div>

            {/* Anthropometric Module */}
            <div className="bg-medical-50/50 p-4 rounded-xl border border-medical-100 grid grid-cols-2 gap-4">
               <div>
                  <p className="text-[10px] font-bold text-medical-600 uppercase">Calculated BMI</p>
                  <p className="text-xl font-black text-slate-800">{bmi}</p>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-medical-600 uppercase mb-1 text-center">MUAC (cm)</label>
                  <input type="number" className="w-full bg-white border p-1 rounded text-center text-sm" value={formData.muac} onChange={(e) => setFormData({...formData, muac: Number(e.target.value)})} />
               </div>
            </div>

            {/* Dietary Module (Main Model Inputs + Extended) */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-tighter">Nutritional Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold flex items-center gap-1"><Droplets size={12} className="text-blue-500"/> Iron (mg)</label>
                  <input type="number" className="w-full border p-2 rounded-lg text-sm" value={formData.iron_intake} onChange={(e) => setFormData({...formData, iron_intake: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold flex items-center gap-1"><Sun size={12} className="text-yellow-600"/> Vit-D (mcg)</label>
                  <input type="number" className="w-full border p-2 rounded-lg text-sm" value={formData.vit_d_intake} onChange={(e) => setFormData({...formData, vit_d_intake: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold flex items-center gap-1"><Beef size={12}/> Protein (g)</label>
                  <input type="number" className="w-full border p-2 rounded-lg text-sm" value={formData.proteins} onChange={(e) => setFormData({...formData, proteins: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold flex items-center gap-1"><Pizza size={12}/> Carbs (g)</label>
                  <input type="number" className="w-full border p-2 rounded-lg text-sm" value={formData.carbs} onChange={(e) => setFormData({...formData, carbs: Number(e.target.value)})} />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold flex items-center gap-1"><Microscope size={12}/> Zinc (mg)</label>
                  <input type="number" className="w-full border p-2 rounded-lg text-sm" value={formData.zinc} onChange={(e) => setFormData({...formData, zinc: Number(e.target.value)})} />
                </div>
              </div>

              {/* Vitamin Spectrum */}
              <div className="grid grid-cols-4 gap-2">
                {['A', 'C', 'E', 'K'].map(v => (
                  <div key={v}>
                    <label className="block text-[10px] font-bold text-center">Vit {v}</label>
                    <input type="number" className="w-full border p-1 rounded text-center text-xs" value={formData[`vit${v}`]} onChange={(e) => setFormData({...formData, [`vit${v}`]: Number(e.target.value)})} />
                  </div>
                ))}
              </div>
            </div>

            <button disabled={loading} className="w-full bg-medical-600 text-white py-4 rounded-xl font-bold hover:bg-medical-500 flex items-center justify-center gap-2">
              {loading ? <RefreshCcw className="animate-spin" /> : <Stethoscope />}
              Generate Clinical Report
            </button>
          </form>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-7 space-y-6">
          {!result && !error && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 glass-card p-12 border-dashed min-h-100">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-center font-medium max-w-xs italic">Awaiting clinical parameters to run Random Forest Diagnostic engine.</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className={`glass-card p-6 border-l-8 ${result.deficiency_risk === 'High' ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Deficiency Risk Status</p>
                    <h2 className="text-3xl font-black text-slate-900">{result.deficiency_risk} Risk</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-medical-600">{result.confidence}%</p>
                    <p className="text-[10px] font-bold text-slate-400">AI CONFIDENCE</p>
                  </div>
                </div>

                {/* Z-Score Visualization (UI-Simulation) */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-3"><Scale size={14}/> Anthropometric Z-Score Mapping</h4>
                  <div className="h-4 w-full bg-slate-200 rounded-full relative">
                    <div className="absolute inset-y-0 left-1/2 w-1 bg-white z-10"></div>
                    <div className="absolute inset-y-0 left-1/4 right-1/4 bg-emerald-400/30"></div>
                    <div className={`absolute top-0 bottom-0 w-2 bg-slate-900 rounded-full shadow-lg transition-all duration-1000`} style={{left: '52%'}}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                    <span>Wasting (-3)</span>
                    <span className="text-emerald-600">Normal (0)</span>
                    <span>Obesity (+3)</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 bg-white/60">
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText size={16}/> Evidence-Based Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="text-sm p-3 bg-medical-50 rounded-lg border border-medical-100 text-slate-600">{rec}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;