import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { PermissionsService } from '../../infrastructure/services/PermissionsService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import './PersonasPage.css';

export const ParametrizacionPage = () => {
  const { user } = useAuth();
  const notification = useNotification();
  const { getEmpresaConfig, updateEmpresaConfig } = useApp();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    razonSocial: '',
    nombreComercial: '',
    ruc: '',
    direccionMatriz: '',
    direccionSucursal: '',
    telefono: '',
    celular: '',
    email: '',
    sitioWeb: '',
    contribuyenteEspecial: 'N/A',
    obligadoContabilidad: 'SI',
    agenteRetencion: 'NO',
    regimenMicroempresas: 'NO',
    actividadEconomica: '',
    codigoCIIU: '',
    representanteLegal: '',
    cedulaRepresentante: '',
    ambienteSRI: 'PRODUCCIÓN',
    tipoEmision: 'NORMAL',
    claveAccesoBase: '',
    establecimiento: '001',
    puntoEmision: '001',
    slogan: '',
    provincia: '',
    ciudad: '',
    codigoPostal: ''
  });

  const canEdit = PermissionsService.userHasPermission(user, PermissionsService.PERMISSIONS.EDIT_MATERIAL);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const config = await getEmpresaConfig.execute();
      if (config) {
        setFormData({
          razonSocial: config.razonSocial || '',
          nombreComercial: config.nombreComercial || '',
          ruc: config.ruc || '',
          direccionMatriz: config.direccionMatriz || '',
          direccionSucursal: config.direccionSucursal || '',
          telefono: config.telefono || '',
          celular: config.celular || '',
          email: config.email || '',
          sitioWeb: config.sitioWeb || '',
          contribuyenteEspecial: config.contribuyenteEspecial || 'N/A',
          obligadoContabilidad: config.obligadoContabilidad || 'SI',
          agenteRetencion: config.agenteRetencion || 'NO',
          regimenMicroempresas: config.regimenMicroempresas || 'NO',
          actividadEconomica: config.actividadEconomica || '',
          codigoCIIU: config.codigoCIIU || '',
          representanteLegal: config.representanteLegal || '',
          cedulaRepresentante: config.cedulaRepresentante || '',
          ambienteSRI: config.ambienteSRI || 'PRODUCCIÓN',
          tipoEmision: config.tipoEmision || 'NORMAL',
          claveAccesoBase: config.claveAccesoBase || '',
          establecimiento: config.establecimiento || '001',
          puntoEmision: config.puntoEmision || '001',
          slogan: config.slogan || '',
          provincia: config.provincia || '',
          ciudad: config.ciudad || '',
          codigoPostal: config.codigoPostal || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      notification.error('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canEdit) {
      notification.error('No tiene permisos para editar la configuración');
      return;
    }

    try {
      await updateEmpresaConfig.execute(formData);
      notification.success('Configuración guardada exitosamente');
      await loadConfig();
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      notification.error(`Error: ${error.message}`);
    }
  };

  if (!PermissionsService.canAccessSection(user, 'materiales')) {
    return (
      <div className="personas-page">
        <Card title="Acceso Denegado">
          <p>No tiene permisos para acceder a la configuración de la empresa.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="personas-page">
        <Card title="Configuración de Empresa">
          <div className="loading">Cargando...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="personas-page">
      <Card title="Configuración de Empresa - Datos para SRI Ecuador">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Información Básica */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333', borderBottom: '2px solid #6FB0F9', paddingBottom: '8px' }}>
              Información Básica
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Razón Social *"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                required
                disabled={!canEdit}
              />
              <Input
                label="Nombre Comercial"
                name="nombreComercial"
                value={formData.nombreComercial}
                onChange={handleChange}
                disabled={!canEdit}
              />
              <Input
                label="RUC (13 dígitos) *"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
                maxLength={13}
                required
                disabled={!canEdit}
              />
              <Input
                label="Slogan"
                name="slogan"
                value={formData.slogan}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333', borderBottom: '2px solid #6FB0F9', paddingBottom: '8px' }}>
              Ubicación
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <Input
                label="Dirección Matriz *"
                name="direccionMatriz"
                value={formData.direccionMatriz}
                onChange={handleChange}
                required
                disabled={!canEdit}
              />
              <Input
                label="Dirección Sucursal"
                name="direccionSucursal"
                value={formData.direccionSucursal}
                onChange={handleChange}
                disabled={!canEdit}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <Input
                  label="Provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
                <Input
                  label="Ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
                <Input
                  label="Código Postal"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333', borderBottom: '2px solid #6FB0F9', paddingBottom: '8px' }}>
              Información de Contacto
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Teléfono *"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                disabled={!canEdit}
              />
              <Input
                label="Celular"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                disabled={!canEdit}
              />
              <Input
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!canEdit}
              />
              <Input
                label="Sitio Web"
                name="sitioWeb"
                value={formData.sitioWeb}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Información Tributaria */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333', borderBottom: '2px solid #6FB0F9', paddingBottom: '8px' }}>
              Información Tributaria SRI
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Contribuyente Especial</label>
                <select
                  name="contribuyenteEspecial"
                  value={formData.contribuyenteEspecial}
                  onChange={handleChange}
                  disabled={!canEdit}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="N/A">N/A</option>
                  <option value="SI">SI</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Obligado a llevar Contabilidad</label>
                <select
                  name="obligadoContabilidad"
                  value={formData.obligadoContabilidad}
                  onChange={handleChange}
                  disabled={!canEdit}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Agente de Retención</label>
                <select
                  name="agenteRetencion"
                  value={formData.agenteRetencion}
                  onChange={handleChange}
                  disabled={!canEdit}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="NO">NO</option>
                  <option value="SI">SI</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Régimen Microempresas</label>
                <select
                  name="regimenMicroempresas"
                  value={formData.regimenMicroempresas}
                  onChange={handleChange}
                  disabled={!canEdit}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="NO">NO</option>
                  <option value="SI">SI</option>
                </select>
              </div>
              <Input
                label="Actividad Económica"
                name="actividadEconomica"
                value={formData.actividadEconomica}
                onChange={handleChange}
                disabled={!canEdit}
              />
              <Input
                label="Código CIIU"
                name="codigoCIIU"
                value={formData.codigoCIIU}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Representante Legal */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333', borderBottom: '2px solid #6FB0F9', paddingBottom: '8px' }}>
              Representante Legal
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Nombre Completo"
                name="representanteLegal"
                value={formData.representanteLegal}
                onChange={handleChange}
                disabled={!canEdit}
              />
              <Input
                label="Cédula"
                name="cedulaRepresentante"
                value={formData.cedulaRepresentante}
                onChange={handleChange}
                maxLength={10}
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Configuración SRI */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333', borderBottom: '2px solid #6FB0F9', paddingBottom: '8px' }}>
              Configuración SRI (Documentos Electrónicos)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Ambiente SRI</label>
                <select
                  name="ambienteSRI"
                  value={formData.ambienteSRI}
                  onChange={handleChange}
                  disabled={!canEdit}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="PRUEBAS">PRUEBAS</option>
                  <option value="PRODUCCIÓN">PRODUCCIÓN</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Tipo de Emisión</label>
                <select
                  name="tipoEmision"
                  value={formData.tipoEmision}
                  onChange={handleChange}
                  disabled={!canEdit}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="CONTINGENCIA">CONTINGENCIA</option>
                </select>
              </div>
              <Input
                label="Clave Acceso Base (8 dígitos)"
                name="claveAccesoBase"
                value={formData.claveAccesoBase}
                onChange={handleChange}
                maxLength={8}
                disabled={!canEdit}
              />
              <Input
                label="Establecimiento (001)"
                name="establecimiento"
                value={formData.establecimiento}
                onChange={handleChange}
                maxLength={3}
                disabled={!canEdit}
              />
              <Input
                label="Punto de Emisión (001)"
                name="puntoEmision"
                value={formData.puntoEmision}
                onChange={handleChange}
                maxLength={3}
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #ddd' }}>
            <Button type="button" variant="secondary" onClick={loadConfig}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={!canEdit}>
              Guardar Configuración
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
