/**
 * Entidad de dominio: ReciboItem
 * Representa un item (material con peso) en un recibo
 */
export class ReciboItem {
  constructor(material, peso) {
    if (!material) {
      throw new Error('El material es requerido');
    }
    if (peso <= 0) {
      throw new Error('El peso debe ser mayor a 0');
    }

    this.materialId = material.id;
    this.nombreMaterial = material.nombre;
    this.precioPorKg = material.precioPorKg;
    this.peso = peso;
    this.unidad = material.unidad;
    this.subtotal = material.calcularTotal(peso);
  }

  /**
   * Convierte la entidad a un objeto plano para persistencia
   */
  toJSON() {
    return {
      materialId: this.materialId,
      nombreMaterial: this.nombreMaterial,
      precioPorKg: this.precioPorKg,
      peso: this.peso,
      unidad: this.unidad,
      subtotal: this.subtotal,
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON(json) {
    const item = Object.create(ReciboItem.prototype);
    Object.assign(item, json);
    return item;
  }
}
