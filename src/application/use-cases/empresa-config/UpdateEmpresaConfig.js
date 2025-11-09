import { EmpresaConfig } from '../../../domain/entities/EmpresaConfig.js';

/**
 * Caso de uso: Actualizar configuración de la empresa
 */
export class UpdateEmpresaConfig {
  constructor(empresaConfigRepository) {
    this.empresaConfigRepository = empresaConfigRepository;
  }

  async execute(configData) {
    // Validar RUC ecuatoriano (13 dígitos)
    if (configData.ruc && configData.ruc.length !== 13) {
      throw new Error('El RUC debe tener 13 dígitos');
    }

    // Validar email
    if (configData.email && !this.isValidEmail(configData.email)) {
      throw new Error('Email inválido');
    }

    const config = new EmpresaConfig(configData);

    if (!config.esValida()) {
      throw new Error('Complete todos los campos obligatorios: Razón Social, RUC, Dirección, Email, Teléfono');
    }

    return await this.empresaConfigRepository.saveConfig(config);
  }

  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
