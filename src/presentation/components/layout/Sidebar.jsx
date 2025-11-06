import { useAuth } from '../../context/AuthContext';
import { PermissionsService } from '../../../infrastructure/services/PermissionsService';
import './Sidebar.css';

export const Sidebar = ({ currentPage, onNavigate }) => {
  const { user } = useAuth();

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', section: 'dashboard' },
    { id: 'recibos', label: 'Recibos', icon: '📝', section: 'recibos' },
    { id: 'materiales', label: 'Materiales', icon: '📦', section: 'materiales' },
    { id: 'personas', label: 'Personas/Vendedores', icon: '👥', section: 'personas' }
  ];

  // Filtrar items según permisos
  const menuItems = allMenuItems.filter(item =>
    PermissionsService.canAccessSection(user, item.section)
  );

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
