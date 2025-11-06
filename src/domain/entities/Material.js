/**
 * Entidad de dominio: Material
 * Representa un material de reciclaje que puede ser comprado
 */
export class Material {
  constructor(id, nombre, precioPorKg, unidad = 'kg', activo = true) {
    this.id = id;
    this.nombre = nombre;
    this.precioPorKg = precioPorKg;
    this.unidad = unidad;
    this.activo = activo;
    this.fechaCreacion = new Date();
    this.fechaActualizacion = new Date();
  }

  /**
   * Actualiza el precio por kilogramo del material
   */
  actualizarPrecio(nuevoPrecio) {
    if (nuevoPrecio <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }
    this.precioPorKg = nuevoPrecio;
    this.fechaActualizacion = new Date();
  }

  /**
   * Calcula el total a pagar por un peso dado
   */
  calcularTotal(peso) {
    if (peso <= 0) {
      throw new Error('El peso debe ser mayor a 0');
    }
    return peso * this.precioPorKg;
  }

  /**
   * Desactiva el material
   */
  desactivar() {
    this.activo = false;
    this.fechaActualizacion = new Date();
  }

  /**
   * Activa el material
   */
  activar() {
    this.activo = true;
    this.fechaActualizacion = new Date();
  }

  /**
   * Convierte la entidad a un objeto plano para persistencia
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      precioPorKg: this.precioPorKg,
      unidad: this.unidad,
      activo: this.activo,
      fechaCreacion: this.fechaCreacion.toISOString(),
      fechaActualizacion: this.fechaActualizacion.toISOString(),
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON(json) {
    const material = new Material(
      json.id,
      json.nombre,
      json.precioPorKg,
      json.unidad,
      json.activo
    );
    material.fechaCreacion = new Date(json.fechaCreacion);
    material.fechaActualizacion = new Date(json.fechaActualizacion);
    return material;
  }
}
