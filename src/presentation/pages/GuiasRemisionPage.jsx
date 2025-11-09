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
import { GuiaRemisionSRI } from '../components/features/GuiaRemisionSRI';
import './PersonasPage.css';

export const GuiasRemisionPage = () => {
  const { user } = useAuth();
  const notification = useNotification();
  const {
    getAllGuiasRemision,
    createGuiaRemision,
    getAllRecibos,
    getAllTransportistas
  } = useApp();

  const [guias, setGuias] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [transportistas, setTransportistas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedGuia, setSelectedGuia] = useState(null);
  const [selectedReciboData, setSelectedReciboData] = useState(null);
  const [loading, setLoading] = useState(false);

  const canCreate = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.CREATE_GUIA);
  const canView = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.VIEW_GUIAS);

  useEffect(() => {
    loadGuias();
    loadRecibos();
    loadTransportistas();
  }, []);

  const loadGuias = async () => {
    setLoading(true);
    try {
      const data = await getAllGuiasRemision.execute();
      setGuias(data);
    } catch (error) {
      console.error('Error al cargar guías de remisión:', error);
      notification.error('Error al cargar las guías de remisión');
    } finally {
      setLoading(false);
    }
  };

  const loadRecibos = async () => {
    try {
      const data = await getAllRecibos.execute();
      setRecibos(data);
    } catch (error) {
      console.error('Error al cargar recibos:', error);
    }
  };

  const loadTransportistas = async () => {
    try {
      const data = await getAllTransportistas.execute();
      setTransportistas(data.filter(t => t.activo));
    } catch (error) {
      console.error('Error al cargar transportistas:', error);
    }
  };

  const handleSubmitForm = async (formData) => {
    try {
      console.log('🔄 Iniciando creación de guía con:', formData);
      const result = await createGuiaRemision.execute(formData);
      console.log('✅ Guía creada exitosamente:', result);

      // Verificar que el resultado tenga los datos necesarios
      if (!result || !result.guia || !result.recibo) {
        throw new Error('La respuesta del servidor no contiene los datos esperados');
      }

      console.log('📝 Recibo de la guía:', result.recibo);
      console.log('📦 Items del recibo:', result.recibo.items);

      notification.success('Guía de remisión generada exitosamente');
      setIsModalOpen(false);
      await loadGuias();

      // Show preview after creation
      setSelectedGuia(result.guia);
      setSelectedReciboData(result.recibo);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('❌ Error al crear guía de remisión:', error);
      console.error('Stack trace:', error.stack);
      notification.error(`Error: ${error.message}`);
    }
  };

  const handleViewGuia = (guia) => {
    setSelectedGuia(guia);
    const recibo = recibos.find(r => r.id === guia.reciboId);
    setSelectedReciboData(recibo);
    setIsPreviewOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const columns = [
    { header: 'Nro. Guía', field: 'numeroGuia' },
    { header: 'Nro. Recibo', field: 'numeroRecibo' },
    { header: 'Transportista', field: 'transportistaNombre' },
    { header: 'Placa', field: 'placaVehiculo' },
    { header: 'Fecha Emisión', render: (g) => formatDate(g.fechaEmision) },
    { header: 'Fecha Traslado', render: (g) => formatDate(g.fechaTraslado) },
    { header: 'Acciones', render: (g) => (
      <div className="table-actions">
        <Button variant="outline" size="small" onClick={() => handleViewGuia(g)}>Ver</Button>
      </div>
    )}
  ];

  if (!canView) {
    return (
      <div className="personas-page">
        <Card title="Acceso Denegado">
          <p>No tiene permisos para ver las guías de remisión.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="personas-page">
      <Card
        title="Gestión de Guías de Remisión"
        actions={canCreate && (
          <Button onClick={() => setIsModalOpen(true)}>
            + Nueva Guía de Remisión
          </Button>
        )}
      >
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <>
            <div className="personas-stats">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{guias.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Este mes:</span>
                <span className="stat-value">
                  {guias.filter(g => {
                    const fecha = new Date(g.fechaEmision);
                    const hoy = new Date();
                    return fecha.getMonth() === hoy.getMonth() &&
                           fecha.getFullYear() === hoy.getFullYear();
                  }).length}
                </span>
              </div>
            </div>
            <Table columns={columns} data={guias} />
          </>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Guía de Remisión"
      >
        <GuiaRemisionForm
          recibos={recibos}
          transportistas={transportistas}
          onSubmit={handleSubmitForm}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedGuia(null);
          setSelectedReciboData(null);
        }}
        title="Guía de Remisión - Formato SRI Ecuador"
        size="large"
      >
        {selectedGuia && selectedReciboData && (
          <GuiaRemisionSRI
            guia={selectedGuia}
            recibo={selectedReciboData}
            onClose={() => {
              setIsPreviewOpen(false);
              setSelectedGuia(null);
              setSelectedReciboData(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

const GuiaRemisionForm = ({ recibos, transportistas, onSubmit, onCancel }) => {
  const notification = useNotification();
  const [formData, setFormData] = useState({
    reciboId: '',
    transportistaId: '',
    placaVehiculo: '',
    marcaVehiculo: '',
    fechaTraslado: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.reciboId || !formData.transportistaId || !formData.placaVehiculo) {
      notification.warning('Complete los campos obligatorios');
      return;
    }

    const recibo = recibos.find(r => r.id === formData.reciboId);
    const transportista = transportistas.find(t => t.id === formData.transportistaId);

    if (!recibo || !transportista) {
      notification.error('Error: No se encontró el recibo o transportista seleccionado');
      return;
    }

    const submitData = {
      reciboId: formData.reciboId,
      numeroRecibo: recibo.numeroRecibo,
      transportistaId: formData.transportistaId,
      transportistaNombre: transportista.getNombreCompleto(),
      placaVehiculo: formData.placaVehiculo.trim().toUpperCase(),
      marcaVehiculo: formData.marcaVehiculo.trim(),
      fechaTraslado: new Date(formData.fechaTraslado),
      observaciones: formData.observaciones.trim()
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="input-group">
        <label className="input-label">Recibo a Trasladar *</label>
        <select
          name="reciboId"
          value={formData.reciboId}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">Seleccione un recibo</option>
          {recibos.map(recibo => (
            <option key={recibo.id} value={recibo.id}>
              {recibo.numeroRecibo} - {recibo.nombreCliente} - S/ {recibo.total.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label className="input-label">Transportista *</label>
        <select
          name="transportistaId"
          value={formData.transportistaId}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">Seleccione un transportista</option>
          {transportistas.map(transportista => (
            <option key={transportista.id} value={transportista.id}>
              {transportista.getNombreCompleto()} - Lic: {transportista.licencia}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Placa del Vehículo *"
          name="placaVehiculo"
          value={formData.placaVehiculo}
          onChange={handleChange}
          placeholder="ABC-123"
          required
        />
        <Input
          label="Marca del Vehículo"
          name="marcaVehiculo"
          value={formData.marcaVehiculo}
          onChange={handleChange}
          placeholder="Toyota, Volvo, etc."
        />
      </div>

      <Input
        label="Fecha de Traslado *"
        name="fechaTraslado"
        type="date"
        value={formData.fechaTraslado}
        onChange={handleChange}
        required
      />

      <div className="input-group">
        <label className="input-label">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows={3}
          placeholder="Información adicional sobre el traslado..."
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary">Generar Guía</Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

