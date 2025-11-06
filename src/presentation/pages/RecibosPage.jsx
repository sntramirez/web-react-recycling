import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ReciboForm } from '../components/features/ReciboForm';
import { ReciboPreview } from '../components/features/ReciboPreview';
import { Table } from '../components/common/Table';
import './RecibosPage.css';

export const RecibosPage = () => {
  const { getAllMaterials, createRecibo, getAllRecibos, getReciboById } = useApp();
  const [materiales, setMateriales] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedRecibo, setSelectedRecibo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [materialesData, recibosData] = await Promise.all([
        getAllMaterials.execute(),
        getAllRecibos.execute()
      ]);
      setMateriales(materialesData);
      setRecibos(recibosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecibo = () => {
    setIsFormModalOpen(true);
  };

  const handleSubmitRecibo = async (reciboData) => {
    try {
      const recibo = await createRecibo.execute(reciboData);
      setIsFormModalOpen(false);
      setSelectedRecibo(recibo);
      setIsPreviewModalOpen(true);
      await loadData();
    } catch (error) {
      console.error('Error al crear recibo:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleViewRecibo = async (recibo) => {
    try {
      const reciboCompleto = await getReciboById.execute(recibo.id);
      setSelectedRecibo(reciboCompleto);
      setIsPreviewModalOpen(true);
    } catch (error) {
      console.error('Error al cargar recibo:', error);
      alert('Error al cargar el recibo');
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    { header: 'No. Recibo', field: 'numeroRecibo' },
    { header: 'Cliente', field: 'nombreCliente' },
    {
      header: 'Fecha',
      render: (recibo) => formatFecha(recibo.fechaEmision)
    },
    {
      header: 'Items',
      render: (recibo) => recibo.items.length
    },
    {
      header: 'Total',
      render: (recibo) => `$${recibo.total.toFixed(2)}`
    },
    {
      header: 'Acciones',
      render: (recibo) => (
        <Button variant="outline" size="small" onClick={() => handleViewRecibo(recibo)}>
          Ver / Imprimir
        </Button>
      )
    }
  ];

  return (
    <div className="recibos-page">
      <Card
        title="Generación de Recibos"
        actions={
          <Button onClick={handleCreateRecibo}>
            + Nuevo Recibo
          </Button>
        }
      >
        {loading ? (
          <div className="loading">Cargando recibos...</div>
        ) : (
          <div>
            <div className="recibos-stats">
              <div className="stat-card">
                <div className="stat-value">{recibos.length}</div>
                <div className="stat-label">Total Recibos</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  ${recibos.reduce((sum, r) => sum + r.total, 0).toFixed(2)}
                </div>
                <div className="stat-label">Total Pagado</div>
              </div>
            </div>

            <div className="recibos-list">
              <h3>Historial de Recibos</h3>
              <Table columns={columns} data={recibos} />
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Nuevo Recibo"
        size="large"
      >
        <ReciboForm
          materiales={materiales}
          onSubmit={handleSubmitRecibo}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedRecibo(null);
        }}
        title="Vista Previa del Recibo"
        size="medium"
      >
        {selectedRecibo && (
          <ReciboPreview
            recibo={selectedRecibo}
            onClose={() => {
              setIsPreviewModalOpen(false);
              setSelectedRecibo(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
