import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Chart as ChartJS,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  User, Droplets, Sun, Stethoscope, AlertCircle, 
  FileText, LogOut, RefreshCcw, Activity, Scale, Beef, Microscope
} from 'lucide-react';
import type { PredictionResponse } from '../types';

// Register ChartJS components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

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
  [key: string]: number;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [formData, setFormData] = useState<ClinicalFormData>({
    age: 25, gender: 1, iron_intake: 8.0, vit_d_intake: 10.0,
    weight: 70, height: 170, muac: 25, proteins: 50,
    carbs: 250, zinc: 11, vitA: 900, vitE: 15, vitC: 90, vitK: 120
  });

  const [bmi, setBmi] = useState(0);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [displayedRecs, setDisplayedRecs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<{label: string, confidence: number}[]>([]);

  const RENDER_API_URL = "https://nutri-predict-ml.onrender.com/predict";

  useEffect(() => {
    if (formData.height > 0) { 
      const heightInMeters = formData.height / 100;
      const calculatedBmi = formData.weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBmi.toFixed(1)));
    }
  }, [formData.weight, formData.height]);

  useEffect(() => {
    if (result) {
      setDisplayedRecs([]);
      setIsTyping(true);
      result.recommendations.forEach((rec, index) => {
        setTimeout(() => {
          setDisplayedRecs(prev => [...prev, rec]);
          if (index === result.recommendations.length - 1) setIsTyping(false);
        }, index * 700); 
      });
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHistory(prev => [...prev.slice(-5), { label: timestamp, confidence: result.confidence }]);
    }
  }, [result]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        age: formData.age,
        gender: formData.gender,
        iron_intake: formData.iron_intake,
        vit_d_intake: formData.vit_d_intake,
        bmi: bmi,
        muac: formData.muac,
        proteins: formData.proteins,
        zinc: formData.zinc
      };
      const response = await axios.post(RENDER_API_URL, payload);
      setResult(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Connection failed. Verify server is live.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: history.map(h => h.label),
    datasets: [{
      label: 'AI Confidence Score %',
      data: history.map(h => h.confidence),
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 5,
    }]
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto bg-slate-50/30">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 glass-card px-4 sm:px-6 py-4 border-b border-white/40">
        <div className="flex items-center gap-2">
          <Activity className="text-medical-600 shrink-0" />
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate tracking-tight uppercase">NutriPredict AI CDSS</h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-bold uppercase text-xs">
          <LogOut size={16} /> Sign Out
        </button>
      </header>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 font-bold"
          >
            <AlertCircle size={20} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5 space-y-6">
          <form onSubmit={handlePredict} className="glass-card p-6 space-y-6 shadow-xl border border-white/50">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-slate-100 pb-4 uppercase tracking-tighter">
              <User className="text-medical-600" size={18} /> Patient Assessment
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Age (Years)</label>
                <input type="number" className="w-full bg-white/50 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-medical-500 font-bold" value={formData.age} onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                <select className="w-full bg-white/50 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-medical-500 font-bold" value={formData.gender} onChange={(e) => setFormData({...formData, gender: Number(e.target.value) as 1 | 2})}>
                  <option value={1}>Male</option>
                  <option value={2}>Female</option>
                </select>
              </div>
            </div>

            <div className="bg-medical-50/50 p-4 rounded-xl border border-medical-100 grid grid-cols-2 gap-4 shadow-inner">
               <div>
                  <p className="text-[10px] font-black text-medical-600 uppercase">Calculated BMI</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tighter">{bmi}</p>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-medical-600 uppercase mb-1 text-center">MUAC (cm)</label>
                  <input type="number" className="w-full bg-white border border-medical-200 p-1 rounded text-center font-bold text-lg" value={formData.muac} onChange={(e) => setFormData({...formData, muac: Number(e.target.value)})} />
               </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-medical-500 pl-3">Clinical Biomarkers</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 flex items-center gap-1 uppercase"><Droplets size={12} className="text-blue-500"/> Iron (mg)</label>
                  <input type="number" step="0.1" className="w-full border p-2 rounded-lg text-sm bg-white font-bold" value={formData.iron_intake} onChange={(e) => setFormData({...formData, iron_intake: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 flex items-center gap-1 uppercase"><Sun size={12} className="text-yellow-600"/> Vit-D (mcg)</label>
                  <input type="number" step="0.1" className="w-full border p-2 rounded-lg text-sm bg-white font-bold" value={formData.vit_d_intake} onChange={(e) => setFormData({...formData, vit_d_intake: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 flex items-center gap-1 uppercase"><Beef size={12}/> Protein (g)</label>
                  <input type="number" className="w-full border p-2 rounded-lg text-sm bg-white font-bold" value={formData.proteins} onChange={(e) => setFormData({...formData, proteins: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 flex items-center gap-1 uppercase"><Microscope size={12}/> Zinc (mg)</label>
                  <input type="number" className="w-full border p-2 rounded-lg text-sm bg-white font-bold" value={formData.zinc} onChange={(e) => setFormData({...formData, zinc: Number(e.target.value)})} />
                </div>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-medical-600 text-white py-4 rounded-xl font-black hover:bg-medical-500 flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] tracking-widest text-xs uppercase">
              {loading ? <RefreshCcw className="animate-spin" /> : <Stethoscope />}
              RUN AI DIAGNOSTICS
            </button>
          </form>
        </section>

        <section className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center glass-card p-12 border-dashed border-2 min-h-125 border-slate-200">
                <Activity size={48} className="text-slate-200 animate-pulse mb-4" />
                <p className="text-center font-bold text-slate-400 max-w-xs italic uppercase text-[10px] tracking-widest">Awaiting clinical parameters for Random Forest Engine.</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`glass-card p-8 border-l-8 shadow-2xl relative overflow-hidden ${result.deficiency_risk === 'High' ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Risk Profile</p>
                      <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{result.deficiency_risk} RISK</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-medical-600 leading-none tracking-tighter">{result.confidence}%</p>
                      <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">AI Precision</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-700 flex items-center gap-2 uppercase tracking-tighter"><Scale size={16}/> Anthropometric Mapping</h4>
                      <div className="h-4 w-full bg-slate-100 rounded-full relative shadow-inner overflow-hidden">
                        <div className="absolute inset-y-0 left-1/4 right-1/4 bg-emerald-400/20" />
                        <motion.div initial={{ left: "50%" }} animate={{ left: `${Math.min(Math.max((bmi - 10) * 2, 0), 100)}%` }} className="absolute top-0 bottom-0 w-2 bg-slate-900 shadow-xl z-10" />
                      </div>
                      <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                        <span>Wasting (-3)</span>
                        <span className="text-emerald-600">Normal Range</span>
                        <span>Obesity (+3)</span>
                      </div>
                    </div>
                    <div className="h-32 bg-white/30 rounded-lg p-2">
                        <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 bg-white/60 backdrop-blur-md border border-white shadow-xl">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                    <h4 className="text-[10px] font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                      <FileText size={18} className="text-medical-600" /> Evidence-Based Action Plan
                    </h4>
                    {isTyping && <div className="flex gap-1 animate-pulse"><div className="w-1.5 h-1.5 bg-medical-400 rounded-full" /><div className="w-1.5 h-1.5 bg-medical-400 rounded-full" /></div>}
                  </div>
                  
                  <div className="space-y-3">
                    {displayedRecs.map((rec, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border text-sm font-bold shadow-sm leading-relaxed ${rec.includes('🚨') || rec.includes('Analysis') || rec.includes('Alert') ? 'bg-red-50/80 border-red-100 text-red-700' : 'bg-white/80 border-slate-200 text-slate-600'}`}
                      >
                        {rec}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;