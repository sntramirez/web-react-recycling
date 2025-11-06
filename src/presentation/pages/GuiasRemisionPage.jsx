import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { PermissionsService } from '../../infrastructure/services/PermissionsService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import jsPDF from 'jspdf';
import './PersonasPage.css';

export const GuiasRemisionPage = () => {
  const { user } = useAuth();
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
      alert('Error al cargar las guías de remisión');
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
      const result = await createGuiaRemision.execute(formData);
      alert('Guía de remisión generada exitosamente');
      setIsModalOpen(false);
      await loadGuias();

      // Show preview after creation
      setSelectedGuia(result.guia);
      setSelectedReciboData(result.recibo);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error al crear guía de remisión:', error);
      alert(`Error: ${error.message}`);
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
        title="Vista Previa - Guía de Remisión"
        size="large"
      >
        {selectedGuia && selectedReciboData && (
          <GuiaRemisionPreview
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
      alert('Complete los campos obligatorios');
      return;
    }

    const recibo = recibos.find(r => r.id === formData.reciboId);
    const transportista = transportistas.find(t => t.id === formData.transportistaId);

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

const GuiaRemisionPreview = ({ guia, recibo, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('GUÍA DE REMISIÓN', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(guia.numeroGuia, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Company info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Centro de Reciclaje EcoRecicla', 20, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('RUC: 20123456789', 20, yPos);
    yPos += 5;
    doc.text('Dirección: Av. Principal 123, Lima, Perú', 20, yPos);
    yPos += 10;

    // Dates section
    doc.setFont('helvetica', 'bold');
    doc.text('Información de Emisión y Traslado', 20, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de Emisión: ${new Date(guia.fechaEmision).toLocaleDateString('es-PE')}`, 20, yPos);
    yPos += 5;
    doc.text(`Fecha de Traslado: ${new Date(guia.fechaTraslado).toLocaleDateString('es-PE')}`, 20, yPos);
    yPos += 10;

    // Transport info
    doc.setFont('helvetica', 'bold');
    doc.text('Datos del Transportista', 20, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${guia.transportistaNombre}`, 20, yPos);
    yPos += 5;
    doc.text(`Placa del Vehículo: ${guia.placaVehiculo}`, 20, yPos);
    yPos += 5;
    if (guia.marcaVehiculo) {
      doc.text(`Marca del Vehículo: ${guia.marcaVehiculo}`, 20, yPos);
      yPos += 5;
    }
    yPos += 5;

    // Receipt info
    doc.setFont('helvetica', 'bold');
    doc.text('Datos del Recibo', 20, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Número de Recibo: ${recibo.numeroRecibo}`, 20, yPos);
    yPos += 5;
    doc.text(`Cliente: ${recibo.nombreCliente}`, 20, yPos);
    yPos += 5;
    if (recibo.personaNombre) {
      doc.text(`Vendedor: ${recibo.personaNombre}`, 20, yPos);
      yPos += 5;
    }
    doc.text(`Monto Total: S/ ${recibo.total.toFixed(2)}`, 20, yPos);
    yPos += 10;

    // Materials table
    doc.setFont('helvetica', 'bold');
    doc.text('Materiales a Transportar', 20, yPos);
    yPos += 7;

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, pageWidth - 40, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Material', 25, yPos + 5);
    doc.text('Peso (kg)', 100, yPos + 5);
    doc.text('Precio/kg', 135, yPos + 5);
    doc.text('Subtotal', 170, yPos + 5);
    yPos += 10;

    // Table rows
    doc.setFont('helvetica', 'normal');
    recibo.items.forEach(item => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(item.nombreMaterial, 25, yPos);
      doc.text(item.peso.toFixed(2), 100, yPos);
      doc.text(`S/ ${item.precioUnitario.toFixed(2)}`, 135, yPos);
      doc.text(`S/ ${item.subtotal.toFixed(2)}`, 170, yPos);
      yPos += 7;
    });

    yPos += 5;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.text(`Peso Total: ${recibo.items.reduce((sum, item) => sum + item.peso, 0).toFixed(2)} kg`, 25, yPos);
    doc.text(`Total: S/ ${recibo.total.toFixed(2)}`, 170, yPos);
    yPos += 10;

    // Observations
    if (guia.observaciones) {
      yPos += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Observaciones:', 20, yPos);
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(guia.observaciones, pageWidth - 40);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 5;
    }

    // Footer
    yPos = Math.max(yPos + 20, 250);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('Este documento es una guía de remisión para el traslado de materiales reciclables.', pageWidth / 2, yPos, { align: 'center' });

    // Save PDF
    doc.save(`Guia_Remision_${guia.numeroGuia}.pdf`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="recibo-preview">
      <div className="recibo-content" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <div className="recibo-header">
          <h2>GUÍA DE REMISIÓN</h2>
          <p className="recibo-numero">{guia.numeroGuia}</p>
        </div>

        <div className="recibo-company-info">
          <h3>Centro de Reciclaje EcoRecicla</h3>
          <p>RUC: 20123456789</p>
          <p>Dirección: Av. Principal 123, Lima, Perú</p>
          <p>Teléfono: (01) 234-5678</p>
        </div>

        <div className="recibo-info">
          <div className="recibo-info-section">
            <h4>Información de Emisión y Traslado</h4>
            <div className="recibo-info-row">
              <span>Fecha de Emisión:</span>
              <span>{formatDate(guia.fechaEmision)}</span>
            </div>
            <div className="recibo-info-row">
              <span>Fecha de Traslado:</span>
              <span>{formatDate(guia.fechaTraslado)}</span>
            </div>
          </div>

          <div className="recibo-info-section">
            <h4>Datos del Transportista</h4>
            <div className="recibo-info-row">
              <span>Nombre:</span>
              <span>{guia.transportistaNombre}</span>
            </div>
            <div className="recibo-info-row">
              <span>Placa del Vehículo:</span>
              <span>{guia.placaVehiculo}</span>
            </div>
            {guia.marcaVehiculo && (
              <div className="recibo-info-row">
                <span>Marca del Vehículo:</span>
                <span>{guia.marcaVehiculo}</span>
              </div>
            )}
          </div>

          <div className="recibo-info-section">
            <h4>Datos del Recibo</h4>
            <div className="recibo-info-row">
              <span>Número de Recibo:</span>
              <span>{recibo.numeroRecibo}</span>
            </div>
            <div className="recibo-info-row">
              <span>Cliente:</span>
              <span>{recibo.nombreCliente}</span>
            </div>
            {recibo.personaNombre && (
              <div className="recibo-info-row">
                <span>Vendedor:</span>
                <span>{recibo.personaNombre}</span>
              </div>
            )}
            <div className="recibo-info-row">
              <span>Monto Total:</span>
              <span>S/ {recibo.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="recibo-items">
          <h4>Materiales a Transportar</h4>
          <table className="recibo-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Peso (kg)</th>
                <th>Precio/kg</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {recibo.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombreMaterial}</td>
                  <td>{item.peso.toFixed(2)}</td>
                  <td>S/ {item.precioUnitario.toFixed(2)}</td>
                  <td>S/ {item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>Peso Total:</strong></td>
                <td><strong>{recibo.items.reduce((sum, item) => sum + item.peso, 0).toFixed(2)} kg</strong></td>
              </tr>
              <tr>
                <td colSpan="3"><strong>Total:</strong></td>
                <td><strong>S/ {recibo.total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {guia.observaciones && (
          <div className="recibo-info-section">
            <h4>Observaciones</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{guia.observaciones}</p>
          </div>
        )}

        <div className="recibo-footer">
          <p>Este documento es una guía de remisión para el traslado de materiales reciclables.</p>
        </div>
      </div>

      <div className="recibo-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Button onClick={handlePrint} variant="primary">
          🖨️ Imprimir
        </Button>
        <Button onClick={handleDownloadPDF} variant="primary">
          📄 Descargar PDF
        </Button>
        <Button onClick={onClose} variant="secondary">
          Cerrar
        </Button>
      </div>
    </div>
  );
};
