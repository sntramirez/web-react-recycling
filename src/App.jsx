import { useState } from 'react';
import { AppProvider } from './presentation/context/AppContext';
import { MaterialesPage } from './presentation/pages/MaterialesPage';
import { RecibosPage } from './presentation/pages/RecibosPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('recibos');

  return (
    <AppProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Centro de Reciclaje</h1>
            <p className="app-subtitle">Sistema de Administración</p>
          </div>
        </header>

        <nav className="app-nav">
          <button
            className={`nav-button ${currentPage === 'recibos' ? 'active' : ''}`}
            onClick={() => setCurrentPage('recibos')}
          >
            Recibos
          </button>
          <button
            className={`nav-button ${currentPage === 'materiales' ? 'active' : ''}`}
            onClick={() => setCurrentPage('materiales')}
          >
            Materiales
          </button>
        </nav>

        <main className="app-main">
          {currentPage === 'recibos' ? <RecibosPage /> : <MaterialesPage />}
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 Centro de Reciclaje - Sistema de Gestión</p>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
