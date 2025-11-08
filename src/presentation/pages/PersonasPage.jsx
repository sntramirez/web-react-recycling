import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { PermissionsService } from '../../infrastructure/services/PermissionsService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { PersonaForm } from '../components/features/PersonaForm';
import './PersonasPage.css';

export const PersonasPage = () => {
  const { user } = useAuth();
  const notification = useNotification();
  const { getAllPersonas, createPersona, updatePersona, deletePersona } = useApp();
  const [personas, setPersonas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verificar permisos
  const canCreate = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.CREATE_PERSONA);
  const canEdit = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.EDIT_PERSONA);
  const canDelete = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.DELETE_PERSONA);

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    setLoading(true);
    try {
      const data = await getAllPersonas.execute();
      setPersonas(data);
    } catch (error) {
      console.error('Error al cargar personas:', error);
      notification.error('Error al cargar las personas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePersona = () => {
    setSelectedPersona(null);
    setIsModalOpen(true);
  };

  const handleEditPersona = (persona) => {
    setSelectedPersona(persona);
    setIsModalOpen(true);
  };

  const handleDeletePersona = async (persona) => {
    if (window.confirm(`¿Está seguro de eliminar a ${persona.getNombreCompleto()}?`)) {
      try {
        await deletePersona.execute(persona.id);
        await loadPersonas();
        notification.success('Persona eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar persona:', error);
        notification.error('Error al eliminar la persona');
      }
    }
  };

  const handleSubmitForm = async (personaData) => {
    try {
      if (selectedPersona) {
        await updatePersona.execute(selectedPersona.id, personaData);
        notification.success('Persona actualizada exitosamente');
      } else {
        await createPersona.execute(personaData);
        notification.success('Persona registrada exitosamente');
      }
      setIsModalOpen(false);
      setSelectedPersona(null);
      await loadPersonas();
    } catch (error) {
      console.error('Error al guardar persona:', error);
      notification.error(`Error: ${error.message}`);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const columns = [
    {
      header: 'Nombre Completo',
      render: (persona) => persona.getNombreCompleto()
    },
    { header: 'Documento', field: 'documentoIdentidad' },
    { header: 'Teléfono', field: 'telefono' },
    {
      header: 'Dirección',
      render: (persona) => persona.direccion || 'N/A'
    },
    {
      header: 'Fecha Registro',
      render: (persona) => formatFecha(persona.fechaRegistro)
    },
    {
      header: 'Estado',
      render: (persona) => (
        <span className={`status-badge ${persona.activo ? 'status-active' : 'status-inactive'}`}>
          {persona.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Acciones',
      render: (persona) => (
        <div className="table-actions">
          {canEdit && (
            <Button variant="outline" size="small" onClick={() => handleEditPersona(persona)}>
              Editar
            </Button>
          )}
          {canDelete && (
            <Button variant="danger" size="small" onClick={() => handleDeletePersona(persona)}>
              Eliminar
            </Button>
          )}
          {!canEdit && !canDelete && (
            <span className="no-actions">Sin permisos</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="personas-page">
      <Card
        title="Gestión de Personas/Vendedores"
        actions={
          canCreate && (
            <Button onClick={handleCreatePersona}>
              + Nueva Persona
            </Button>
          )
        }
      >
        <div className="personas-info">
          <p>Registro de personas que venden material reciclado al centro.</p>
        </div>

        {loading ? (
          <div className="loading">Cargando personas...</div>
        ) : (
          <>
            <div className="personas-stats">
              <div className="stat-item">
                <span className="stat-label">Total Registradas:</span>
                <span className="stat-value">{personas.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Activas:</span>
                <span className="stat-value">{personas.filter(p => p.activo).length}</span>
              </div>
            </div>
            <Table columns={columns} data={personas} />
          </>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPersona(null);
        }}
        title={selectedPersona ? 'Editar Persona' : 'Registrar Nueva Persona'}
      >
        <PersonaForm
          persona={selectedPersona}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedPersona(null);
          }}
        />
      </Modal>
    </div>
  );
};
