import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import './MaterialForm.css';

export const MaterialForm = ({ material, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precioPorKg: '',
    unidad: 'kg',
    activo: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (material) {
      setFormData({
        nombre: material.nombre,
        precioPorKg: material.precioPorKg.toString(),
        unidad: material.unidad,
        activo: material.activo
      });
    }
  }, [material]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    const precio = parseFloat(formData.precioPorKg);
    if (!formData.precioPorKg || isNaN(precio) || precio <= 0) {
      newErrors.precioPorKg = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      nombre: formData.nombre.trim(),
      precioPorKg: parseFloat(formData.precioPorKg),
      unidad: formData.unidad,
      activo: formData.activo
    });
  };

  return (
    <form onSubmit={handleSubmit} className="material-form">
      <Input
        label="Nombre del Material"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ej: Acero, Cartón, Plástico..."
        required
        error={errors.nombre}
      />

      <Input
        label="Precio por Kg ($)"
        name="precioPorKg"
        type="number"
        value={formData.precioPorKg}
        onChange={handleChange}
        placeholder="0.00"
        step="0.01"
        min="0"
        required
        error={errors.precioPorKg}
      />

      <div className="input-group">
        <label className="input-label">Unidad de Medida</label>
        <select
          name="unidad"
          value={formData.unidad}
          onChange={handleChange}
          className="input"
        >
          <option value="kg">Kilogramos (kg)</option>
          <option value="ton">Toneladas (ton)</option>
          <option value="lb">Libras (lb)</option>
        </select>
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
          />
          <span>Material activo</span>
        </label>
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary">
          {material ? 'Actualizar' : 'Crear'} Material
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
