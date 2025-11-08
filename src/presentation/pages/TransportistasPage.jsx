import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { PermissionsService } from '../../infrastructure/services/PermissionsService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import './PersonasPage.css';

export const TransportistasPage = () => {
  const { user } = useAuth();
  const notification = useNotification();
  const { getAllTransportistas, createTransportista, updateTransportista, deleteTransportista } = useApp();
  const [transportistas, setTransportistas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransportista, setSelectedTransportista] = useState(null);
  const [loading, setLoading] = useState(false);

  const canCreate = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.CREATE_TRANSPORTISTA);
  const canEdit = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.EDIT_TRANSPORTISTA);
  const canDelete = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.DELETE_TRANSPORTISTA);

  useEffect(() => {
    loadTransportistas();
  }, []);

  const loadTransportistas = async () => {
    setLoading(true);
    try {
      const data = await getAllTransportistas.execute();
      setTransportistas(data);
    } catch (error) {
      console.error('Error al cargar transportistas:', error);
      notification.error('Error al cargar los transportistas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (selectedTransportista) {
        await updateTransportista.execute(selectedTransportista.id, formData);
        notification.success('Transportista actualizado exitosamente');
      } else {
        await createTransportista.execute(formData);
        notification.success('Transportista registrado exitosamente');
      }
      setIsModalOpen(false);
      setSelectedTransportista(null);
      await loadTransportistas();
    } catch (error) {
      console.error('Error al guardar transportista:', error);
      notification.error(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (transportista) => {
    if (window.confirm(`¿Está seguro de eliminar a ${transportista.getNombreCompleto()}?`)) {
      try {
        await deleteTransportista.execute(transportista.id);
        await loadTransportistas();
        notification.success('Transportista eliminado exitosamente');
      } catch (error) {
        notification.error('Error al eliminar el transportista');
      }
    }
  };

  const columns = [
    { header: 'Nombre Completo', render: (t) => t.getNombreCompleto() },
    { header: 'Licencia', field: 'licencia' },
    { header: 'Teléfono', field: 'telefono' },
    { header: 'Empresa', render: (t) => t.empresa || 'Independiente' },
    { header: 'Estado', render: (t) => <span className={`status-badge status-${t.activo ? 'active' : 'inactive'}`}>{t.activo ? 'Activo' : 'Inactivo'}</span> },
    { header: 'Acciones', render: (t) => (
      <div className="table-actions">
        {canEdit && <Button variant="outline" size="small" onClick={() => { setSelectedTransportista(t); setIsModalOpen(true); }}>Editar</Button>}
        {canDelete && <Button variant="danger" size="small" onClick={() => handleDelete(t)}>Eliminar</Button>}
      </div>
    )}
  ];

  return (
    <div className="personas-page">
      <Card title="Gestión de Transportistas" actions={canCreate && <Button onClick={() => { setSelectedTransportista(null); setIsModalOpen(true); }}>+ Nuevo Transportista</Button>}>
        {loading ? <div className="loading">Cargando...</div> : (
          <>
            <div className="personas-stats">
              <div className="stat-item"><span className="stat-label">Total:</span><span className="stat-value">{transportistas.length}</span></div>
              <div className="stat-item"><span className="stat-label">Activos:</span><span className="stat-value">{transportistas.filter(t => t.activo).length}</span></div>
            </div>
            <Table columns={columns} data={transportistas} />
          </>
        )}
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedTransportista(null); }} title={selectedTransportista ? 'Editar Transportista' : 'Nuevo Transportista'}>
        <TransportistaForm transportista={selectedTransportista} onSubmit={handleSubmitForm} onCancel={() => { setIsModalOpen(false); setSelectedTransportista(null); }} />
      </Modal>
    </div>
  );
};

const TransportistaForm = ({ transportista, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ nombre: '', apellido: '', licencia: '', telefono: '', empresa: '', activo: true });

  useEffect(() => {
    if (transportista) setFormData({ nombre: transportista.nombre, apellido: transportista.apellido, licencia: transportista.licencia, telefono: transportista.telefono, empresa: transportista.empresa, activo: transportista.activo });
  }, [transportista]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.licencia.trim() || !formData.telefono.trim()) {
      alert('Complete los campos obligatorios');
      return;
    }
    onSubmit({ nombre: formData.nombre.trim(), apellido: formData.apellido.trim(), licencia: formData.licencia.trim(), telefono: formData.telefono.trim(), empresa: formData.empresa.trim(), activo: formData.activo });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
        <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
      </div>
      <Input label="Licencia de Conducir" name="licencia" value={formData.licencia} onChange={handleChange} required />
      <Input label="Teléfono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} required />
      <Input label="Empresa (Opcional)" name="empresa" value={formData.empresa} onChange={handleChange} />
      <div className="checkbox-group"><label className="checkbox-label"><input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} /><span>Transportista activo</span></label></div>
      <div className="form-actions"><Button type="submit" variant="primary">{transportista ? 'Actualizar' : 'Registrar'}</Button>{onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>}</div>
    </form>
  );
};
