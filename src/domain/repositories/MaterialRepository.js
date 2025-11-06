/**
 * Interfaz del repositorio de Material
 * Define el contrato para la persistencia de materiales
 */
export class MaterialRepository {
  async findAll() {
    throw new Error('Método findAll() debe ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado');
  }

  async save(material) {
    throw new Error('Método save() debe ser implementado');
  }

  async update(material) {
    throw new Error('Método update() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }
}
