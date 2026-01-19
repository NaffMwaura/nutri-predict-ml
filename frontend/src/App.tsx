import { useState } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// Define the available views for our clinical system
type View = 'landing' | 'login' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');

  // Simple navigation handler
  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0); // Reset scroll position on navigation
  };

  return (
    <div className="antialiased selection:bg-medical-100">
      {/* Conditional Rendering: 
        This is where we swap between your project descriptions 
        and the actual ML software.
      */}
      
      {currentView === 'landing' && (
        <Landing onStart={() => navigateTo('login')} />
      )}

      {currentView === 'login' && (
        <Login 
          onLogin={() => navigateTo('dashboard')} 
          onBack={() => navigateTo('landing')} 
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard onLogout={() => navigateTo('landing')} />
      )}

      {/* Footer - Consistent across all medical views */}
      <footer className="py-8 px-6 text-center text-slate-500 text-sm">
        <p>© 2026 NutriPredict AI System</p>
        <p className="mt-1">Developed by Victor Mwendia Macharia • Supervisor: Dr. Monica</p>
      </footer>
    </div>
  );
}

export default App;