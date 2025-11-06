import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PermissionsService } from '../../../infrastructure/services/PermissionsService';
import './Header.css';

export const Header = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      logout();
    }
  };

  const handleNavigate = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="header-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <div>
              <h1>Centro de Reciclaje</h1>
              <span>Sistema de Administración</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.nombre}</span>
              <span className="user-role">{user?.rol}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {PermissionsService.canAccessSection(user, 'dashboard') && (
            <button
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => handleNavigate('dashboard')}
            >
              📊 Dashboard
            </button>
          )}
          {PermissionsService.canAccessSection(user, 'recibos') && (
            <button
              className={currentPage === 'recibos' ? 'active' : ''}
              onClick={() => handleNavigate('recibos')}
            >
              📝 Recibos
            </button>
          )}
          {PermissionsService.canAccessSection(user, 'materiales') && (
            <button
              className={currentPage === 'materiales' ? 'active' : ''}
              onClick={() => handleNavigate('materiales')}
            >
              📦 Materiales
            </button>
          )}
          {PermissionsService.canAccessSection(user, 'personas') && (
            <button
              className={currentPage === 'personas' ? 'active' : ''}
              onClick={() => handleNavigate('personas')}
            >
              👥 Personas
            </button>
          )}
          {PermissionsService.canAccessSection(user, 'transportistas') && (
            <button
              className={currentPage === 'transportistas' ? 'active' : ''}
              onClick={() => handleNavigate('transportistas')}
            >
              🚚 Transportistas
            </button>
          )}
          {PermissionsService.canAccessSection(user, 'guias') && (
            <button
              className={currentPage === 'guias' ? 'active' : ''}
              onClick={() => handleNavigate('guias')}
            >
              📋 Guías de Remisión
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
