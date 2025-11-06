/**
 * Caso de uso: Eliminar Material
 */
export class DeleteMaterial {
  constructor(materialRepository) {
    this.materialRepository = materialRepository;
  }

  async execute(id) {
    const material = await this.materialRepository.findById(id);

    if (!material) {
      throw new Error('Material no encontrado');
    }

    await this.materialRepository.delete(id);

    return true;
  }
}
