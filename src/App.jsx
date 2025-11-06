import { useState } from 'react';
import { AuthProvider, useAuth } from './presentation/context/AuthContext';
import { AppProvider } from './presentation/context/AppContext';
import { LoginPage } from './presentation/pages/LoginPage';
import { DashboardPage } from './presentation/pages/DashboardPage';
import { MaterialesPage } from './presentation/pages/MaterialesPage';
import { RecibosPage } from './presentation/pages/RecibosPage';
import { Header } from './presentation/components/layout/Header';
import { Sidebar } from './presentation/components/layout/Sidebar';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <LoginPage />;
  }

  return (
    <AppProvider>
      <div className="app">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />

        <div className="app-container">
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

          <main className="app-main">
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'recibos' && <RecibosPage />}
            {currentPage === 'materiales' && <MaterialesPage />}
          </main>
        </div>

        <footer className="app-footer">
          <p>&copy; 2025 Centro de Reciclaje - Sistema de Gestión</p>
        </footer>
      </div>
    </AppProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
