import { Recibo } from '../../../domain/entities/Recibo.js';
import { ReciboItem } from '../../../domain/entities/ReciboItem.js';

/**
 * Caso de uso: Crear Recibo
 */
export class CreateRecibo {
  constructor(reciboRepository, materialRepository) {
    this.reciboRepository = reciboRepository;
    this.materialRepository = materialRepository;
  }

  async execute(reciboData) {
    // Validar que hay items
    if (!reciboData.items || reciboData.items.length === 0) {
      throw new Error('El recibo debe tener al menos un item');
    }

    // Generar ID único
    const id = Date.now().toString();

    // Crear nueva entidad Recibo
    const recibo = new Recibo(id, reciboData.nombreCliente || 'Cliente General');

    // Agregar items al recibo
    for (const itemData of reciboData.items) {
      // Obtener el material
      const material = await this.materialRepository.findById(itemData.materialId);

      if (!material) {
        throw new Error(`Material con ID ${itemData.materialId} no encontrado`);
      }

      if (!material.activo) {
        throw new Error(`El material ${material.nombre} no está activo`);
      }

      // Crear el item del recibo
      const reciboItem = new ReciboItem(material, itemData.peso);
      recibo.agregarItem(reciboItem);
    }

    // Validar recibo
    if (!recibo.esValido()) {
      throw new Error('El recibo no es válido');
    }

    // Persistir el recibo
    await this.reciboRepository.save(recibo);

    return recibo;
  }
}
