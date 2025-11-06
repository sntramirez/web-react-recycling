/**
 * Entidad de dominio: GuiaRemision
 * Representa una guía de remisión para transporte de material
 */
export class GuiaRemision {
  constructor(
    id,
    reciboId,
    numeroRecibo,
    transportistaId,
    transportistaNombre,
    placaVehiculo,
    marcaVehiculo = '',
    observaciones = ''
  ) {
    this.id = id;
    this.numeroGuia = this.generarNumeroGuia();
    this.reciboId = reciboId;
    this.numeroRecibo = numeroRecibo;
    this.transportistaId = transportistaId;
    this.transportistaNombre = transportistaNombre;
    this.placaVehiculo = placaVehiculo;
    this.marcaVehiculo = marcaVehiculo;
    this.observaciones = observaciones;
    this.fechaEmision = new Date();
    this.fechaTraslado = new Date(); // Fecha estimada de traslado
  }

  /**
   * Genera un número de guía único
   */
  generarNumeroGuia() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `GR-${año}${mes}${dia}-${random}`;
  }

  /**
   * Actualiza la fecha de traslado
   */
  actualizarFechaTraslado(nuevaFecha) {
    this.fechaTraslado = new Date(nuevaFecha);
  }

  /**
   * Convierte la entidad a un objeto plano para persistencia
   */
  toJSON() {
    return {
      id: this.id,
      numeroGuia: this.numeroGuia,
      reciboId: this.reciboId,
      numeroRecibo: this.numeroRecibo,
      transportistaId: this.transportistaId,
      transportistaNombre: this.transportistaNombre,
      placaVehiculo: this.placaVehiculo,
      marcaVehiculo: this.marcaVehiculo,
      observaciones: this.observaciones,
      fechaEmision: this.fechaEmision.toISOString(),
      fechaTraslado: this.fechaTraslado.toISOString(),
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON(json) {
    const guia = new GuiaRemision(
      json.id,
      json.reciboId,
      json.numeroRecibo,
      json.transportistaId,
      json.transportistaNombre,
      json.placaVehiculo,
      json.marcaVehiculo,
      json.observaciones
    );
    guia.numeroGuia = json.numeroGuia;
    guia.fechaEmision = new Date(json.fechaEmision);
    guia.fechaTraslado = new Date(json.fechaTraslado);
    return guia;
  }
}
