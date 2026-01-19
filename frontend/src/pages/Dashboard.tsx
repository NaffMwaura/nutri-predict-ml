import { useState } from 'react';
import axios from 'axios';
import { 
  User, 
  Droplets, 
  Sun, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  LogOut,
  RefreshCcw,
  Activity
} from 'lucide-react';
import type { PredictionRequest, PredictionResponse } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [formData, setFormData] = useState<PredictionRequest>({
    age: 25,
    gender: 1,
    iron_intake: 8.0,
    vit_d_intake: 10.0
  });

  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // IMPORTANT: Ensure this matches your live Render backend URL
  const RENDER_API_URL = "https://nutri-predict-ml.onrender.com/predict"; 

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(RENDER_API_URL, formData);
      setResult(response.data);
    } catch (err) {
      setError('Connection failed. Ensure the backend is live and CORS is configured.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header - Mobile Responsive */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 glass-card px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2">
          <Activity className="text-medical-600 shrink-0" />
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">Clinical Dashboard</h1>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Left: Input Form - Full width on mobile, 2/5 on desktop */}
        <section className="lg:col-span-2 space-y-6">
          <div className="glass-card p-5 sm:p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-medical-600" /> Patient Assessment
            </h2>
            
            <form onSubmit={handlePredict} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Age (Years)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/50 border border-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 transition-all text-base"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Gender</label>
                  <select 
                    className="w-full bg-white/50 border border-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 transition-all text-base"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: Number(e.target.value) as 1 | 2})}
                  >
                    <option value={1}>Male</option>
                    <option value={2}>Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Droplets size={14} className="text-blue-500" /> Dietary Iron (mg/day)
                  </span>
                </label>
                <input 
                  type="number" step="0.1"
                  className="w-full bg-white/50 border border-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 text-base"
                  value={formData.iron_intake}
                  onChange={(e) => setFormData({...formData, iron_intake: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Sun size={14} className="text-yellow-600" /> Dietary Vit-D (mcg/day)
                  </span>
                </label>
                <input 
                  type="number" step="0.1"
                  className="w-full bg-white/50 border border-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 text-base"
                  value={formData.vit_d_intake}
                  onChange={(e) => setFormData({...formData, vit_d_intake: Number(e.target.value)})}
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-medical-600 text-white py-4 rounded-xl font-bold hover:bg-medical-500 transition-all shadow-lg shadow-medical-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {loading ? <RefreshCcw className="animate-spin" /> : <Stethoscope />}
                Generate Diagnostic Report
              </button>
            </form>
          </div>
        </section>

        {/* Right: Results Display - Full width on mobile, 3/5 on desktop */}
        <section className="lg:col-span-3">
          {!result && !error && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 glass-card p-8 sm:p-12 border-dashed min-h-75">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-center font-medium max-w-xs">Awaiting patient data to generate AI risk assessment.</p>
            </div>
          )}

          {error && (
            <div className="glass-card p-6 bg-red-50/50 border-red-200">
              <div className="flex items-center gap-3 text-red-600 font-bold mb-2">
                <AlertCircle /> System Error
              </div>
              <p className="text-sm text-red-500 leading-relaxed">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Primary Risk Card */}
              <div className={`glass-card p-6 sm:p-8 border-l-8 shadow-2xl ${result.deficiency_risk === 'High' ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">ML Prediction Result</h3>
                    <div className="flex items-center gap-2">
                      {result.deficiency_risk === 'High' ? 
                        <AlertCircle className="text-red-500" size={24} /> : 
                        <CheckCircle2 className="text-emerald-500" size={24} />
                      }
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {result.deficiency_risk} Risk
                      </span>
                    </div>
                  </div>
                  <div className="bg-medical-50 px-4 py-2 rounded-xl border border-medical-100 w-full sm:w-auto text-center sm:text-right">
                    <span className="text-2xl sm:text-3xl font-bold text-medical-600 block leading-none">{result.confidence}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Model Confidence</span>
                  </div>
                </div>

                <div className="p-5 bg-white/40 rounded-xl border border-white/50">
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-medical-600" /> Evidence-Based Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-3 leading-relaxed">
                        <span className="text-medical-500 font-bold shrink-0">•</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Insights Box */}
              <div className="glass-card p-5 sm:p-6 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Activity size={60} />
                </div>
                <h4 className="font-bold flex items-center gap-2 text-medical-400 relative z-10">
                  <Activity size={18} /> Technical Insights
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed relative z-10">
                  Prediction based on Random Forest analysis of NHANES 2017-2018 datasets. 
                  Model utilizes non-linear correlations between 24-hr recall intakes and 
                  clinical biomarkers. <strong>Disclaimer:</strong> This tool is for clinical 
                  support and research visualization only.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;