import { ReciboItem } from './ReciboItem';

/**
 * Entidad de dominio: Recibo
 * Representa un comprobante de compra de materiales de reciclaje
 */
export class Recibo {
  constructor(id, nombreCliente = 'Cliente General', personaId = null, personaNombre = null) {
    this.id = id;
    this.numeroRecibo = this.generarNumeroRecibo();
    this.nombreCliente = nombreCliente;
    this.personaId = personaId; // ID de la persona/vendedor
    this.personaNombre = personaNombre; // Nombre completo del vendedor
    this.items = [];
    this.fechaEmision = new Date();
    this.total = 0;
  }

  /**
   * Genera un número de recibo único
   */
  generarNumeroRecibo() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REC-${año}${mes}${dia}-${random}`;
  }

  /**
   * Agrega un item al recibo
   */
  agregarItem(reciboItem) {
    this.items.push(reciboItem);
    this.calcularTotal();
  }

  /**
   * Elimina un item del recibo por índice
   */
  eliminarItem(indice) {
    if (indice < 0 || indice >= this.items.length) {
      throw new Error('Índice inválido');
    }
    this.items.splice(indice, 1);
    this.calcularTotal();
  }

  /**
   * Calcula el total del recibo
   */
  calcularTotal() {
    this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  /**
   * Obtiene el peso total de todos los materiales
   */
  getPesoTotal() {
    return this.items.reduce((sum, item) => sum + item.peso, 0);
  }

  /**
   * Valida que el recibo tenga al menos un item
   */
  esValido() {
    return this.items.length > 0;
  }

  /**
   * Convierte la entidad a un objeto plano para persistencia
   */
  toJSON() {
    return {
      id: this.id,
      numeroRecibo: this.numeroRecibo,
      nombreCliente: this.nombreCliente,
      personaId: this.personaId,
      personaNombre: this.personaNombre,
      items: this.items.map(item => item.toJSON()),
      fechaEmision: this.fechaEmision.toISOString(),
      total: this.total,
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON(json) {
    const recibo = new Recibo(json.id, json.nombreCliente, json.personaId, json.personaNombre);
    recibo.numeroRecibo = json.numeroRecibo;
    recibo.fechaEmision = new Date(json.fechaEmision);
    recibo.items = json.items.map(item => ReciboItem.fromJSON(item));
    recibo.total = json.total;
    return recibo;
  }
}
