import { EmpresaConfigRepository } from '../../domain/repositories/EmpresaConfigRepository.js';
import { EmpresaConfig } from '../../domain/entities/EmpresaConfig.js';

export class LocalStorageEmpresaConfigRepository extends EmpresaConfigRepository {
  constructor() {
    super();
    this.STORAGE_KEY = 'empresaConfig';
  }

  async getConfig() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return null;
      }
      return EmpresaConfig.fromJSON(JSON.parse(data));
    } catch (error) {
      console.error('Error al obtener configuración de empresa:', error);
      return null;
    }
  }

  async saveConfig(empresaConfig) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(empresaConfig.toJSON()));
      return empresaConfig;
    } catch (error) {
      console.error('Error al guardar configuración de empresa:', error);
      throw new Error('Error al guardar la configuración');
    }
  }
}
