import { Material } from '../../../domain/entities/Material.js';

/**
 * Caso de uso: Crear Material
 */
export class CreateMaterial {
  constructor(materialRepository) {
    this.materialRepository = materialRepository;
  }

  async execute(materialData) {
    // Generar ID único
    const id = Date.now().toString();

    // Crear nueva entidad Material
    const material = new Material(
      id,
      materialData.nombre,
      materialData.precioPorKg,
      materialData.unidad || 'kg',
      true
    );

    // Persistir el material
    await this.materialRepository.save(material);

    return material;
  }
}
