/**
 * Interfaz del repositorio de configuración de empresa
 */
export class EmpresaConfigRepository {
  async getConfig() {
    throw new Error('Método getConfig() debe ser implementado');
  }

  async saveConfig(empresaConfig) {
    throw new Error('Método saveConfig() debe ser implementado');
  }
}
