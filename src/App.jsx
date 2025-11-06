import { useState } from 'react';
import { AuthProvider, useAuth } from './presentation/context/AuthContext';
import { AppProvider } from './presentation/context/AppContext';
import { PermissionsService } from './infrastructure/services/PermissionsService';
import { LoginPage } from './presentation/pages/LoginPage';
import { DashboardPage } from './presentation/pages/DashboardPage';
import { MaterialesPage } from './presentation/pages/MaterialesPage';
import { RecibosPage } from './presentation/pages/RecibosPage';
import { PersonasPage } from './presentation/pages/PersonasPage';
import { Header } from './presentation/components/layout/Header';
import { Sidebar } from './presentation/components/layout/Sidebar';
import './App.css';

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Determinar página inicial según permisos
  const getInitialPage = () => {
    if (!user) return 'dashboard';

    if (PermissionsService.canAccessSection(user, 'dashboard')) return 'dashboard';
    if (PermissionsService.canAccessSection(user, 'recibos')) return 'recibos';
    if (PermissionsService.canAccessSection(user, 'materiales')) return 'materiales';
    if (PermissionsService.canAccessSection(user, 'personas')) return 'personas';

    return 'dashboard';
  };

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
            {currentPage === 'dashboard' && PermissionsService.canAccessSection(user, 'dashboard') && <DashboardPage />}
            {currentPage === 'recibos' && PermissionsService.canAccessSection(user, 'recibos') && <RecibosPage />}
            {currentPage === 'materiales' && PermissionsService.canAccessSection(user, 'materiales') && <MaterialesPage />}
            {currentPage === 'personas' && PermissionsService.canAccessSection(user, 'personas') && <PersonasPage />}
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
