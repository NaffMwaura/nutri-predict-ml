import { Activity, Beaker, ChevronRight, Zap, Database, ShieldCheck } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing = ({ onStart }: LandingProps) => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-nav px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="text-medical-600" />
          <span className="font-bold text-xl tracking-tight text-medical-900">NutriPredict AI</span>
        </div>
        <button 
          onClick={onStart}
          className="bg-medical-600 text-white px-5 py-2 rounded-full font-medium hover:bg-medical-500 transition-all shadow-lg shadow-medical-500/20"
        >
          Launch Diagnostics
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 glass-card text-medical-600 font-semibold text-xs uppercase tracking-widest">
              Final Year Project • January 2026
            </div>
            <h1 className="text-5xl font-extrabold leading-tight text-slate-900">
              Predictive AI for <br />
              <span className="text-medical-600">Nutritional Health</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Developed by <span className="text-slate-900 font-semibold">Victor Mwendia Macharia</span> under the supervision of <span className="text-slate-900 font-semibold">Dr. Amos Ronoh</span>. 
              Our CDSS (Clinical Decision Support System) leverages machine learning to detect nutrient deficiencies before clinical symptoms manifest.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onStart}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
              >
                Access System <ChevronRight size={20} />
              </button>
              <div className="flex items-center gap-3 px-4 py-2">
                <ShieldCheck className="text-medical-600" size={24} />
                <span className="text-sm text-slate-500 font-medium">HIPAA Compliant <br />Architecture</span>
              </div>
            </div>
          </div>

          {/* Feature Display */}
          <div className="relative">
            <div className="absolute -inset-4 bg-medical-500/10 blur-3xl rounded-full" />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6 translate-y-4">
                <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mb-4 text-medical-600">
                  <Database size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">NHANES Data</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Trained on 2017-2018 cycles using actual serum biomarkers and 24-hr dietary recalls.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mb-4 text-medical-600">
                  <Zap size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Random Forest</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Utilizes non-linear decision trees for high-precision diagnostic explainability.
                </p>
              </div>

              <div className="glass-card p-6 md:col-span-2 bg-white/40">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center shrink-0 text-medical-600">
                    <Beaker size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Biochemical Validation</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Models validated against Serum Ferritin (Iron) and 25-hydroxyvitamin D clinical thresholds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Overview Section */}
        <section className="mt-24 py-12 border-t border-slate-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-3xl font-bold text-medical-600">65%</h4>
              <p className="text-sm font-medium text-slate-500 mt-2">Model Accuracy</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-medical-600">FastAPI</h4>
              <p className="text-sm font-medium text-slate-500 mt-2">High-Performance Backend</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-medical-600">React TS</h4>
              <p className="text-sm font-medium text-slate-500 mt-2">Modern Clinical UI</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;