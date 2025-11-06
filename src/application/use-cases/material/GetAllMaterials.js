/**
 * Caso de uso: Obtener todos los materiales
 */
export class GetAllMaterials {
  constructor(materialRepository) {
    this.materialRepository = materialRepository;
  }

  async execute() {
    return await this.materialRepository.findAll();
  }
}
