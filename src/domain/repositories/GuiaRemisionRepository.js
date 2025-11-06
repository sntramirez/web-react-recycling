/**
 * Interfaz del repositorio de GuiaRemision
 */
export class GuiaRemisionRepository {
  async findAll() {
    throw new Error('Método findAll() debe ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado');
  }

  async findByReciboId(reciboId) {
    throw new Error('Método findByReciboId() debe ser implementado');
  }

  async save(guiaRemision) {
    throw new Error('Método save() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }
}
