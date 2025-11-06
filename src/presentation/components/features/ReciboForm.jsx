import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Table } from '../common/Table';
import './ReciboForm.css';

export const ReciboForm = ({ materiales, onSubmit, onCancel }) => {
  const [nombreCliente, setNombreCliente] = useState('Cliente General');
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [peso, setPeso] = useState('');
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});

  const materialesActivos = materiales.filter(m => m.activo);

  useEffect(() => {
    if (materialesActivos.length > 0 && !selectedMaterialId) {
      setSelectedMaterialId(materialesActivos[0].id);
    }
  }, [materialesActivos, selectedMaterialId]);

  const handleAgregarItem = () => {
    setErrors({});

    if (!selectedMaterialId) {
      setErrors({ material: 'Seleccione un material' });
      return;
    }

    const pesoNum = parseFloat(peso);
    if (!peso || isNaN(pesoNum) || pesoNum <= 0) {
      setErrors({ peso: 'El peso debe ser mayor a 0' });
      return;
    }

    const material = materiales.find(m => m.id === selectedMaterialId);
    const subtotal = material.precioPorKg * pesoNum;

    const nuevoItem = {
      materialId: material.id,
      nombreMaterial: material.nombre,
      precioPorKg: material.precioPorKg,
      peso: pesoNum,
      unidad: material.unidad,
      subtotal: subtotal
    };

    setItems([...items, nuevoItem]);
    setPeso('');
  };

  const handleEliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrors({ items: 'Debe agregar al menos un material' });
      return;
    }

    onSubmit({
      nombreCliente: nombreCliente.trim() || 'Cliente General',
      items: items
    });
  };

  const columns = [
    { header: 'Material', field: 'nombreMaterial' },
    {
      header: 'Peso',
      render: (item) => `${item.peso.toFixed(2)} ${item.unidad}`
    },
    {
      header: 'Precio/Kg',
      render: (item) => `$${item.precioPorKg.toFixed(2)}`
    },
    {
      header: 'Subtotal',
      render: (item) => `$${item.subtotal.toFixed(2)}`
    },
    {
      header: 'Acciones',
      render: (item, index) => (
        <Button
          variant="danger"
          size="small"
          onClick={() => handleEliminarItem(index)}
        >
          Eliminar
        </Button>
      )
    }
  ];

  if (materialesActivos.length === 0) {
    return (
      <div className="recibo-form-empty">
        <p>No hay materiales activos disponibles.</p>
        <p>Por favor, cree y active algunos materiales primero.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="recibo-form">
      <div className="recibo-form-header">
        <Input
          label="Nombre del Cliente"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          placeholder="Nombre del cliente"
        />
      </div>

      <div className="recibo-form-add-item">
        <h3>Agregar Material</h3>
        <div className="add-item-inputs">
          <div className="input-group" style={{ flex: 2 }}>
            <label className="input-label">Material</label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="input"
            >
              {materialesActivos.map(material => (
                <option key={material.id} value={material.id}>
                  {material.nombre} (${material.precioPorKg}/kg)
                </option>
              ))}
            </select>
            {errors.material && <span className="error-message">{errors.material}</span>}
          </div>

          <Input
            label="Peso (kg)"
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            error={errors.peso}
          />

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button type="button" onClick={handleAgregarItem}>
              Agregar
            </Button>
          </div>
        </div>
      </div>

      <div className="recibo-form-items">
        <h3>Materiales Agregados</h3>
        <Table
          columns={columns}
          data={items.map((item, index) => ({ ...item, index }))}
        />
        {errors.items && <span className="error-message">{errors.items}</span>}
      </div>

      <div className="recibo-form-total">
        <h2>Total: ${calcularTotal().toFixed(2)}</h2>
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary" disabled={items.length === 0}>
          Generar Recibo
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};
