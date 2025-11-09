/**
 * Caso de uso: Obtener configuración de la empresa
 */
export class GetEmpresaConfig {
  constructor(empresaConfigRepository) {
    this.empresaConfigRepository = empresaConfigRepository;
  }

  async execute() {
    return await this.empresaConfigRepository.getConfig();
  }
}
