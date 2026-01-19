import { useState } from 'react';
import { Lock, Mail, ChevronLeft, ShieldAlert } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const Login = ({ onLogin, onBack }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Authorized Credentials
  const AUTH_EMAIL = "victor@nutripredict.ai";
  const AUTH_PASS = "admin2026";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === AUTH_EMAIL && password === AUTH_PASS) {
      onLogin();
    } else {
      setError('Invalid clinical credentials. Please check your email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-card p-8 relative overflow-hidden">
        {/* Subtle Decorative Gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-medical-500/10 rounded-full blur-3xl" />
        
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-slate-500 hover:text-medical-600 transition-colors mb-8 text-sm font-medium"
        >
          <ChevronLeft size={16} /> Back to Landing
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-medical-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-medical-600 shadow-inner">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Clinical Access</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to access the NutriPredict AI Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="clinician@nutripredict.ai"
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-xs font-medium border border-red-100 animate-pulse">
              <ShieldAlert size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
          >
            Authorize Access
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/30 text-center">
          <p className="text-xs text-slate-400">
            Authorized Personnel Only. All diagnostic attempts are logged for clinical audit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;