import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { MaterialForm } from '../components/features/MaterialForm';
import './MaterialesPage.css';

export const MaterialesPage = () => {
  const { getAllMaterials, createMaterial, updateMaterial, deleteMaterial } = useApp();
  const [materiales, setMateriales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(false);

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
      alert('Error al cargar los materiales');
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
        alert('Material eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar material:', error);
        alert('Error al eliminar el material');
      }
    }
  };

  const handleSubmitForm = async (materialData) => {
    try {
      if (selectedMaterial) {
        await updateMaterial.execute(selectedMaterial.id, materialData);
        alert('Material actualizado exitosamente');
      } else {
        await createMaterial.execute(materialData);
        alert('Material creado exitosamente');
      }
      setIsModalOpen(false);
      setSelectedMaterial(null);
      await loadMateriales();
    } catch (error) {
      console.error('Error al guardar material:', error);
      alert(`Error: ${error.message}`);
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
          <Button variant="outline" size="small" onClick={() => handleEditMaterial(material)}>
            Editar
          </Button>
          <Button variant="danger" size="small" onClick={() => handleDeleteMaterial(material)}>
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="materiales-page">
      <Card
        title="Gestión de Materiales de Reciclaje"
        actions={
          <Button onClick={handleCreateMaterial}>
            + Nuevo Material
          </Button>
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
