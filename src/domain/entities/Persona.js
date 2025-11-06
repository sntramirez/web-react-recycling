/**
 * Entidad de dominio: Persona
 * Representa una persona que vende material reciclado
 */
export class Persona {
  constructor(id, nombre, apellido, telefono, direccion, documentoIdentidad, activo = true) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.direccion = direccion;
    this.documentoIdentidad = documentoIdentidad;
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
   * Actualiza los datos de la persona
   */
  actualizarDatos(datos) {
    if (datos.nombre !== undefined) this.nombre = datos.nombre;
    if (datos.apellido !== undefined) this.apellido = datos.apellido;
    if (datos.telefono !== undefined) this.telefono = datos.telefono;
    if (datos.direccion !== undefined) this.direccion = datos.direccion;
    if (datos.documentoIdentidad !== undefined) this.documentoIdentidad = datos.documentoIdentidad;
    this.fechaActualizacion = new Date();
  }

  /**
   * Desactiva la persona
   */
  desactivar() {
    this.activo = false;
    this.fechaActualizacion = new Date();
  }

  /**
   * Activa la persona
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
      telefono: this.telefono,
      direccion: this.direccion,
      documentoIdentidad: this.documentoIdentidad,
      activo: this.activo,
      fechaRegistro: this.fechaRegistro.toISOString(),
      fechaActualizacion: this.fechaActualizacion.toISOString(),
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON(json) {
    const persona = new Persona(
      json.id,
      json.nombre,
      json.apellido,
      json.telefono,
      json.direccion,
      json.documentoIdentidad,
      json.activo
    );
    persona.fechaRegistro = new Date(json.fechaRegistro);
    persona.fechaActualizacion = new Date(json.fechaActualizacion);
    return persona;
  }
}
