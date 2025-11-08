import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { PermissionsService } from '../../infrastructure/services/PermissionsService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { MaterialForm } from '../components/features/MaterialForm';
import './MaterialesPage.css';

export const MaterialesPage = () => {
  const { user } = useAuth();
  const notification = useNotification();
  const { getAllMaterials, createMaterial, updateMaterial, deleteMaterial } = useApp();
  const [materiales, setMateriales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verificar permisos
  const canCreate = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.CREATE_MATERIAL);
  const canEdit = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.EDIT_MATERIAL);
  const canDelete = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.DELETE_MATERIAL);
  const canChangePrice = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.CHANGE_PRICE);

  useEffect(() => {
    loadMateriales();
  }, []);

  const loadMateriales = async () => {
    setLoading(true);
    try {
      const data = await getAllMaterials.execute();
      setMateriales(data);
    } catch (error) {
      console.error('Error al cargar materiales:', error);
      notification.error('Error al cargar los materiales');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = () => {
    setSelectedMaterial(null);
    setIsModalOpen(true);
  };

  const handleEditMaterial = (material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleDeleteMaterial = async (material) => {
    if (window.confirm(`¿Está seguro de eliminar el material "${material.nombre}"?`)) {
      try {
        await deleteMaterial.execute(material.id);
        await loadMateriales();
        notification.success('Material eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar material:', error);
        notification.error('Error al eliminar el material');
      }
    }
  };

  const handleSubmitForm = async (materialData) => {
    try {
      if (selectedMaterial) {
        await updateMaterial.execute(selectedMaterial.id, materialData);
        notification.success('Material actualizado exitosamente');
      } else {
        await createMaterial.execute(materialData);
        notification.success('Material creado exitosamente');
      }
      setIsModalOpen(false);
      setSelectedMaterial(null);
      await loadMateriales();
    } catch (error) {
      console.error('Error al guardar material:', error);
      notification.error(`Error: ${error.message}`);
    }
  };

  const columns = [
    { header: 'Nombre', field: 'nombre' },
    {
      header: 'Precio/Kg',
      render: (material) => `$${material.precioPorKg.toFixed(2)}`
    },
    { header: 'Unidad', field: 'unidad' },
    {
      header: 'Estado',
      render: (material) => (
        <span className={`status-badge ${material.activo ? 'status-active' : 'status-inactive'}`}>
          {material.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Acciones',
      render: (material) => (
        <div className="table-actions">
          {canEdit && (
            <Button variant="outline" size="small" onClick={() => handleEditMaterial(material)}>
              Editar
            </Button>
          )}
          {canDelete && (
            <Button variant="danger" size="small" onClick={() => handleDeleteMaterial(material)}>
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
    <div className="materiales-page">
      <Card
        title="Gestión de Materiales de Reciclaje"
        actions={
          canCreate && (
            <Button onClick={handleCreateMaterial}>
              + Nuevo Material
            </Button>
          )
        }
      >
        {loading ? (
          <div className="loading">Cargando materiales...</div>
        ) : (
          <Table columns={columns} data={materiales} />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMaterial(null);
        }}
        title={selectedMaterial ? 'Editar Material' : 'Nuevo Material'}
      >
        <MaterialForm
          material={selectedMaterial}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedMaterial(null);
          }}
        />
      </Modal>
    </div>
  );
};
