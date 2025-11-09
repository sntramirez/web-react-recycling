import { Button } from '../common/Button';
import jsPDF from 'jspdf';
import './GuiaRemisionSRI.css';

export const GuiaRemisionSRI = ({ guia, recibo, onClose }) => {
  // Información de la empresa (esto debería venir de configuración)
  const empresaInfo = {
    razonSocial: 'CENTRO DE RECICLAJE ECORECICLA S.A.',
    nombreComercial: 'EcoRecicla',
    ruc: '1791234567001',
    direccionMatriz: 'Av. Amazonas N24-03 y Colón, Quito - Ecuador',
    contribuyenteEspecial: 'N/A',
    obligadoContabilidad: 'SI',
    telefono: '02-2234567',
    email: 'info@ecorecicla.com.ec'
  };

  const comprobanteInfo = {
    ambiente: 'PRODUCCIÓN',
    emision: 'NORMAL',
    claveAcceso: generarClaveAcceso(),
    autorizacion: '1234567890123456789012345678901234567890123456789',
    fechaAutorizacion: new Date().toLocaleString('es-EC')
  };

  function generarClaveAcceso() {
    // Formato: ddmmyyyyttcccccccccccrrrrrrrrrrnnnnnnnnnc
    const fecha = new Date();
    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const yyyy = fecha.getFullYear();
    const tt = '06'; // Tipo de comprobante: 06 = Guía de Remisión
    const ruc = empresaInfo.ruc;
    const ambiente = '1'; // 1=Pruebas, 2=Producción
    const serie = '001001';
    const secuencial = guia.numeroGuia.split('-')[2] || '000000001';
    const codigoNumerico = '12345678';
    const tipoEmision = '1'; // 1=Normal

    const claveBase = `${dd}${mm}${yyyy}${tt}${ruc}${ambiente}${serie}${secuencial}${codigoNumerico}${tipoEmision}`;
    const digitoVerificador = calcularDigitoVerificador(claveBase);

    return `${claveBase}${digitoVerificador}`;
  }

  function calcularDigitoVerificador(clave) {
    // Algoritmo módulo 11
    const factores = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7];
    let suma = 0;
    for (let i = 0; i < clave.length; i++) {
      suma += parseInt(clave[i]) * factores[i];
    }
    const residuo = suma % 11;
    const digito = residuo === 0 ? 0 : 11 - residuo;
    return digito === 11 ? 0 : digito;
  }

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 15;

      // Encabezado - Información de la empresa
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(empresaInfo.razonSocial, 15, yPos);
      yPos += 4;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`${empresaInfo.direccionMatriz}`, 15, yPos);
      yPos += 4;
      doc.text(`Teléfono: ${empresaInfo.telefono}`, 15, yPos);
      yPos += 4;
      doc.text(`Email: ${empresaInfo.email}`, 15, yPos);
      yPos += 8;

      // Cuadro de información del RUC y comprobante
      doc.rect(120, 15, 75, 30);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('RUC:', 125, 20);
      doc.setFont('helvetica', 'normal');
      doc.text(empresaInfo.ruc, 145, 20);

      doc.setFont('helvetica', 'bold');
      doc.text('GUÍA DE REMISIÓN', 125, 26);
      doc.setFont('helvetica', 'normal');
      doc.text(`No. ${guia.numeroGuia}`, 125, 31);

      doc.setFontSize(7);
      doc.text(`AUTORIZACIÓN SRI`, 125, 36);
      doc.text(comprobanteInfo.autorizacion.substring(0, 20), 125, 40);
      doc.text(comprobanteInfo.autorizacion.substring(20), 125, 43);

      // Información adicional empresa
      yPos = 53;
      doc.setFontSize(7);
      doc.text(`Contribuyente Especial: ${empresaInfo.contribuyenteEspecial}`, 15, yPos);
      yPos += 3;
      doc.text(`Obligado a llevar Contabilidad: ${empresaInfo.obligadoContabilidad}`, 15, yPos);
      yPos += 3;
      doc.text(`Ambiente: ${comprobanteInfo.ambiente} | Emisión: ${comprobanteInfo.emision}`, 15, yPos);
      yPos += 3;
      doc.text(`CLAVE DE ACCESO`, 15, yPos);
      yPos += 3;
      doc.setFontSize(8);
      doc.text(comprobanteInfo.claveAcceso.substring(0, 25), 15, yPos);
      yPos += 3;
      doc.text(comprobanteInfo.claveAcceso.substring(25), 15, yPos);
      yPos += 8;

      // Información del traslado
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN DEL TRASLADO', 15, yPos);
      yPos += 5;

      // Fechas y motivo
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Fecha Inicio Traslado:', 15, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date(guia.fechaEmision).toLocaleDateString('es-EC'), 60, yPos);

      doc.setFont('helvetica', 'bold');
      doc.text('Fecha Fin Traslado:', 110, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date(guia.fechaTraslado).toLocaleDateString('es-EC'), 155, yPos);
      yPos += 5;

      doc.setFont('helvetica', 'bold');
      doc.text('Motivo Traslado:', 15, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text('Venta', 60, yPos);
      yPos += 8;

      // Dirección de partida
      doc.setFont('helvetica', 'bold');
      doc.text('DIRECCIÓN DE PARTIDA', 15, yPos);
      yPos += 4;
      doc.setFont('helvetica', 'normal');
      doc.text(empresaInfo.direccionMatriz, 15, yPos);
      yPos += 8;

      // Destinatario (Cliente)
      doc.setFont('helvetica', 'bold');
      doc.text('DESTINATARIO', 15, yPos);
      yPos += 4;
      doc.setFont('helvetica', 'normal');
      doc.text(`Identificación: ${recibo.personaNombre || 'CONSUMIDOR FINAL'}`, 15, yPos);
      yPos += 4;
      doc.text(`Razón Social: ${recibo.nombreCliente}`, 15, yPos);
      yPos += 8;

      // Transportista
      doc.setFont('helvetica', 'bold');
      doc.text('DATOS DEL TRANSPORTISTA', 15, yPos);
      yPos += 4;
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${guia.transportistaNombre}`, 15, yPos);
      yPos += 4;
      doc.text(`Licencia: ${guia.transportistaId}`, 15, yPos);
      yPos += 4;
      doc.text(`Placa: ${guia.placaVehiculo}${guia.marcaVehiculo ? ' | Marca: ' + guia.marcaVehiculo : ''}`, 15, yPos);
      yPos += 8;

      // Tabla de detalles
      doc.setFont('helvetica', 'bold');
      doc.text('DETALLE DE PRODUCTOS', 15, yPos);
      yPos += 5;

      // Encabezados de tabla
      doc.setFillColor(220, 220, 220);
      doc.rect(15, yPos - 3, pageWidth - 30, 6, 'F');
      doc.setFontSize(7);
      doc.text('Código', 17, yPos);
      doc.text('Descripción', 40, yPos);
      doc.text('Cantidad', 130, yPos);
      doc.text('Peso (kg)', 160, yPos);
      yPos += 5;

      // Filas de productos
      doc.setFont('helvetica', 'normal');
      if (recibo.items && Array.isArray(recibo.items)) {
        recibo.items.forEach((item, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }

          const codigo = item.materialId || '';
          const descripcion = item.nombreMaterial || '';
          const cantidad = '1';
          const peso = item.peso ? item.peso.toFixed(2) : '0.00';

          doc.text(codigo.substring(0, 10), 17, yPos);
          doc.text(descripcion.substring(0, 50), 40, yPos);
          doc.text(cantidad, 135, yPos);
          doc.text(peso, 165, yPos);
          yPos += 4;
        });
      }

      yPos += 5;
      doc.setFont('helvetica', 'bold');
      const pesoTotal = recibo.items ? recibo.items.reduce((sum, item) => sum + (item.peso || 0), 0) : 0;
      doc.text(`PESO TOTAL: ${pesoTotal.toFixed(2)} kg`, 130, yPos);
      yPos += 10;

      // Observaciones
      if (guia.observaciones) {
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES:', 15, yPos);
        yPos += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        const obsLines = doc.splitTextToSize(guia.observaciones, pageWidth - 30);
        doc.text(obsLines, 15, yPos);
        yPos += obsLines.length * 3;
      }

      // Firma electrónica (pie de página)
      yPos = Math.max(yPos + 10, 260);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'italic');
      doc.text('Documento autorizado electrónicamente por el SRI', pageWidth / 2, yPos, { align: 'center' });
      yPos += 3;
      doc.text(`Fecha y Hora de Autorización: ${comprobanteInfo.fechaAutorizacion}`, pageWidth / 2, yPos, { align: 'center' });

      doc.save(`GuiaRemision_${guia.numeroGuia}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!guia || !recibo || !recibo.items || !Array.isArray(recibo.items)) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Error: No se pueden cargar los datos de la guía.</p>
        <Button onClick={onClose} variant="secondary">Cerrar</Button>
      </div>
    );
  }

  return (
    <div className="guia-remision-sri">
      <div className="guia-content">
        {/* Encabezado */}
        <div className="guia-header">
          <div className="empresa-info">
            <h2>{empresaInfo.razonSocial}</h2>
            <p>{empresaInfo.direccionMatriz}</p>
            <p>Teléfono: {empresaInfo.telefono}</p>
            <p>Email: {empresaInfo.email}</p>
          </div>
          <div className="comprobante-info">
            <div className="info-box">
              <p><strong>RUC:</strong> {empresaInfo.ruc}</p>
              <h3>GUÍA DE REMISIÓN</h3>
              <p><strong>No.</strong> {guia.numeroGuia}</p>
              <p className="small"><strong>AUTORIZACIÓN SRI</strong></p>
              <p className="small">{comprobanteInfo.autorizacion}</p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="info-adicional">
          <p>Contribuyente Especial: {empresaInfo.contribuyenteEspecial}</p>
          <p>Obligado a llevar Contabilidad: {empresaInfo.obligadoContabilidad}</p>
          <p>Ambiente: {comprobanteInfo.ambiente} | Emisión: {comprobanteInfo.emision}</p>
          <div className="clave-acceso">
            <strong>CLAVE DE ACCESO:</strong>
            <p>{comprobanteInfo.claveAcceso}</p>
          </div>
        </div>

        {/* Información del traslado */}
        <div className="seccion">
          <h4>INFORMACIÓN DEL TRASLADO</h4>
          <div className="grid-2">
            <p><strong>Fecha Inicio Traslado:</strong> {formatDate(guia.fechaEmision)}</p>
            <p><strong>Fecha Fin Traslado:</strong> {formatDate(guia.fechaTraslado)}</p>
          </div>
          <p><strong>Motivo Traslado:</strong> Venta</p>
        </div>

        {/* Dirección de partida */}
        <div className="seccion">
          <h4>DIRECCIÓN DE PARTIDA</h4>
          <p>{empresaInfo.direccionMatriz}</p>
        </div>

        {/* Destinatario */}
        <div className="seccion">
          <h4>DESTINATARIO</h4>
          <p><strong>Identificación:</strong> {recibo.personaNombre || 'CONSUMIDOR FINAL'}</p>
          <p><strong>Razón Social:</strong> {recibo.nombreCliente}</p>
        </div>

        {/* Transportista */}
        <div className="seccion">
          <h4>DATOS DEL TRANSPORTISTA</h4>
          <p><strong>Nombre:</strong> {guia.transportistaNombre}</p>
          <p><strong>Licencia:</strong> {guia.transportistaId}</p>
          <p><strong>Placa:</strong> {guia.placaVehiculo} {guia.marcaVehiculo && `| Marca: ${guia.marcaVehiculo}`}</p>
        </div>

        {/* Detalle de productos */}
        <div className="seccion">
          <h4>DETALLE DE PRODUCTOS</h4>
          <table className="tabla-productos">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Peso (kg)</th>
              </tr>
            </thead>
            <tbody>
              {recibo.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.materialId}</td>
                  <td>{item.nombreMaterial}</td>
                  <td>1</td>
                  <td>{item.peso ? item.peso.toFixed(2) : '0.00'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>PESO TOTAL:</strong></td>
                <td><strong>{recibo.items.reduce((sum, item) => sum + (item.peso || 0), 0).toFixed(2)} kg</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Observaciones */}
        {guia.observaciones && (
          <div className="seccion">
            <h4>OBSERVACIONES</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{guia.observaciones}</p>
          </div>
        )}

        {/* Pie de página */}
        <div className="guia-footer">
          <p className="small">Documento autorizado electrónicamente por el SRI</p>
          <p className="small">Fecha y Hora de Autorización: {comprobanteInfo.fechaAutorizacion}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="guia-actions">
        <Button onClick={handleDownloadPDF} variant="primary">
          📄 Descargar PDF
        </Button>
        <Button onClick={() => window.print()} variant="primary">
          🖨️ Imprimir
        </Button>
        <Button onClick={onClose} variant="secondary">
          Cerrar
        </Button>
      </div>
    </div>
  );
};
