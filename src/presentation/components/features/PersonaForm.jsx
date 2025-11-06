import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import './PersonaForm.css';

export const PersonaForm = ({ persona, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    documentoIdentidad: '',
    activo: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (persona) {
      setFormData({
        nombre: persona.nombre,
        apellido: persona.apellido,
        telefono: persona.telefono,
        direccion: persona.direccion,
        documentoIdentidad: persona.documentoIdentidad,
        activo: persona.activo
      });
    }
  }, [persona]);

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

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.documentoIdentidad.trim()) {
      newErrors.documentoIdentidad = 'El documento de identidad es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
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
      apellido: formData.apellido.trim(),
      telefono: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
      documentoIdentidad: formData.documentoIdentidad.trim(),
      activo: formData.activo
    });
  };

  return (
    <form onSubmit={handleSubmit} className="persona-form">
      <div className="form-row">
        <Input
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Juan"
          required
          error={errors.nombre}
        />

        <Input
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Ej: Pérez"
          required
          error={errors.apellido}
        />
      </div>

      <Input
        label="Documento de Identidad"
        name="documentoIdentidad"
        value={formData.documentoIdentidad}
        onChange={handleChange}
        placeholder="Ej: DNI, Cédula, Pasaporte"
        required
        error={errors.documentoIdentidad}
      />

      <Input
        label="Teléfono"
        name="telefono"
        type="tel"
        value={formData.telefono}
        onChange={handleChange}
        placeholder="Ej: +52 123 456 7890"
        required
        error={errors.telefono}
      />

      <Input
        label="Dirección"
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        placeholder="Calle, Ciudad, Estado (Opcional)"
      />

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
          />
          <span>Persona activa</span>
        </label>
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary">
          {persona ? 'Actualizar' : 'Registrar'} Persona
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
