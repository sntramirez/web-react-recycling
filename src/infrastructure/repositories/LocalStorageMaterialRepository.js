import { MaterialRepository } from '../../domain/repositories/MaterialRepository.js';
import { Material } from '../../domain/entities/Material.js';
import { LocalStorageService } from '../persistence/LocalStorageService.js';

/**
 * Implementación del repositorio de Material usando LocalStorage
 */
export class LocalStorageMaterialRepository extends MaterialRepository {
  constructor() {
    super();
    this.storage = new LocalStorageService('materiales');
    this.initializeDefaultMaterials();
  }

  /**
   * Inicializa materiales por defecto si no existen
   */
  initializeDefaultMaterials() {
    const materials = this.storage.getAll();
    if (materials.length === 0) {
      const defaultMaterials = [
        new Material('1', 'Acero', 15.50, 'kg', true),
        new Material('2', 'Cartón', 2.00, 'kg', true),
        new Material('3', 'Plástico PET', 8.00, 'kg', true),
        new Material('4', 'Aluminio', 25.00, 'kg', true),
        new Material('5', 'Vidrio', 1.50, 'kg', true),
        new Material('6', 'Papel', 1.80, 'kg', true),
        new Material('7', 'Cobre', 85.00, 'kg', true),
        new Material('8', 'Bronce', 55.00, 'kg', true),
      ];

      defaultMaterials.forEach(material => {
        this.storage.save(material.toJSON());
      });
    }
  }

  async findAll() {
    const materialsData = this.storage.getAll();
    return materialsData.map(data => Material.fromJSON(data));
  }

  async findById(id) {
    const materialData = this.storage.getById(id);
    return materialData ? Material.fromJSON(materialData) : null;
  }

  async save(material) {
    this.storage.save(material.toJSON());
    return material;
  }

  async update(material) {
    this.storage.update(material.toJSON());
    return material;
  }

  async delete(id) {
    return this.storage.delete(id);
  }
}
