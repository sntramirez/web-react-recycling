/**
 * Caso de uso: Actualizar Material
 */
export class UpdateMaterial {
  constructor(materialRepository) {
    this.materialRepository = materialRepository;
  }

  async execute(id, updates) {
    // Obtener el material existente
    const material = await this.materialRepository.findById(id);

    if (!material) {
      throw new Error('Material no encontrado');
    }

    // Actualizar propiedades
    if (updates.nombre !== undefined) {
      material.nombre = updates.nombre;
    }

    if (updates.precioPorKg !== undefined) {
      material.actualizarPrecio(updates.precioPorKg);
    }

    if (updates.unidad !== undefined) {
      material.unidad = updates.unidad;
    }

    if (updates.activo !== undefined) {
      if (updates.activo) {
        material.activar();
      } else {
        material.desactivar();
      }
    }

    // Persistir cambios
    await this.materialRepository.update(material);

    return material;
  }
}
