import { useRef } from 'react';
import { Button } from '../common/Button';
import './ReciboPreview.css';

export const ReciboPreview = ({ recibo, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    // Crear un iframe oculto para la impresión
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';

    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recibo ${recibo.numeroRecibo}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              max-width: 80mm;
              margin: 0;
              padding: 10px;
            }
            .recibo-print {
              width: 100%;
            }
            .recibo-header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .recibo-title {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .recibo-subtitle {
              font-size: 12px;
              margin: 5px 0;
            }
            .recibo-info {
              margin-bottom: 10px;
              font-size: 12px;
            }
            .recibo-info-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
            }
            .recibo-items {
              margin-bottom: 10px;
            }
            .recibo-items-header {
              font-weight: bold;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
              margin-bottom: 5px;
              font-size: 11px;
            }
            .recibo-item {
              margin: 5px 0;
              font-size: 11px;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
            }
            .recibo-total {
              border-top: 2px solid #000;
              padding-top: 10px;
              margin-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              font-weight: bold;
            }
            .recibo-footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 10px;
              border-top: 2px dashed #000;
              font-size: 10px;
            }
            @media print {
              body {
                margin: 0;
                padding: 5px;
              }
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    frameDoc.close();

    // Esperar a que se cargue el contenido antes de imprimir
    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 250);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPesoTotal = () => {
    return recibo.items.reduce((sum, item) => sum + item.peso, 0);
  };

  return (
    <div className="recibo-preview-container">
      <div ref={printRef} className="recibo-print">
        <div className="recibo-header">
          <h1 className="recibo-title">CENTRO DE RECICLAJE</h1>
          <p className="recibo-subtitle">Comprobante de Compra</p>
          <p className="recibo-subtitle">No. {recibo.numeroRecibo}</p>
        </div>

        <div className="recibo-info">
          <div className="recibo-info-row">
            <span>Fecha:</span>
            <span>{formatFecha(recibo.fechaEmision)}</span>
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
        </div>

        <div className="recibo-items">
          <div className="recibo-items-header">
            MATERIALES
          </div>
          {recibo.items.map((item, index) => (
            <div key={index} className="recibo-item">
              <div className="item-row">
                <span>{item.nombreMaterial}</span>
              </div>
              <div className="item-row">
                <span>{item.peso.toFixed(2)} {item.unidad} x ${item.precioPorKg.toFixed(2)}</span>
                <span>${item.subtotal.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="recibo-summary">
          <div className="recibo-info-row">
            <span>Peso Total:</span>
            <span>{getPesoTotal().toFixed(2)} kg</span>
          </div>
        </div>

        <div className="recibo-total">
          <div className="total-row">
            <span>TOTAL A PAGAR:</span>
            <span>${recibo.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="recibo-footer">
          <p>Gracias por contribuir al reciclaje</p>
          <p>¡Cuidemos nuestro planeta!</p>
        </div>
      </div>

      <div className="recibo-actions">
        <Button variant="primary" onClick={handlePrint}>
          Imprimir Recibo
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};
