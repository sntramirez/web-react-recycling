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
      precioUnitario: this.precioPorKg, // Usar precioUnitario en JSON
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
    // Manejar ambos nombres de campo para retrocompatibilidad
    const precioUnitario = json.precioUnitario || json.precioPorKg;
    Object.assign(item, {
      materialId: json.materialId,
      nombreMaterial: json.nombreMaterial,
      precioPorKg: precioUnitario,
      precioUnitario: precioUnitario, // Agregar también como precioUnitario
      peso: json.peso,
      unidad: json.unidad,
      subtotal: json.subtotal,
    });
    return item;
  }
}
