/**
 * Entidad de dominio: Transportista
 * Representa un transportista/conductor que transporta material
 */
export class Transportista {
  constructor(id, nombre, apellido, licencia, telefono, empresa = '', activo = true) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.licencia = licencia; // Número de licencia de conducir
    this.telefono = telefono;
    this.empresa = empresa; // Empresa de transporte (opcional)
    this.activo = activo;
    this.fechaRegistro = new Date();
    this.fechaActualizacion = new Date();
  }

  /**
   * Obtiene el nombre completo
   */
  getNombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  /**
   * Actualiza los datos del transportista
   */
  actualizarDatos(datos) {
    if (datos.nombre !== undefined) this.nombre = datos.nombre;
    if (datos.apellido !== undefined) this.apellido = datos.apellido;
    if (datos.licencia !== undefined) this.licencia = datos.licencia;
    if (datos.telefono !== undefined) this.telefono = datos.telefono;
    if (datos.empresa !== undefined) this.empresa = datos.empresa;
    this.fechaActualizacion = new Date();
  }

  /**
   * Desactiva el transportista
   */
  desactivar() {
    this.activo = false;
    this.fechaActualizacion = new Date();
  }

  /**
   * Activa el transportista
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
      apellido: this.apellido,
      licencia: this.licencia,
      telefono: this.telefono,
      empresa: this.empresa,
      activo: this.activo,
      fechaRegistro: this.fechaRegistro.toISOString(),
      fechaActualizacion: this.fechaActualizacion.toISOString(),
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON(json) {
    const transportista = new Transportista(
      json.id,
      json.nombre,
      json.apellido,
      json.licencia,
      json.telefono,
      json.empresa,
      json.activo
    );
    transportista.fechaRegistro = new Date(json.fechaRegistro);
    transportista.fechaActualizacion = new Date(json.fechaActualizacion);
    return transportista;
  }
}
