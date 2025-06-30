import { useState } from 'react';
import AthleteList from './components/AthleteList';
import Navigation from './components/Navigation';
import Login from './components/Login';
import { useAuth } from './hooks/useAuth';

type CurrentView = 'athletes' | 'events';

function App() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<CurrentView>('athletes');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-lg text-neutral-600">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'athletes':
        return <AthleteList />;
      case 'events':
        return (
          <div className="p-6 bg-neutral-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Meus Eventos</h1>
              <p className="text-neutral-600 mb-8">Gerencie seus torneios e eventos</p>
              <div className="bg-white rounded-xl p-12 text-center shadow-card">
                <div className="text-neutral-500 text-lg mb-4">Em breve</div>
                <p className="text-neutral-400">
                  A funcionalidade de eventos estará disponível em breve
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <AthleteList />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        userInitials="Adilson"
        onLogout={logout}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;