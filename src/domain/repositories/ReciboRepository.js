/**
 * Interfaz del repositorio de Recibo
 * Define el contrato para la persistencia de recibos
 */
export class ReciboRepository {
  async findAll() {
    throw new Error('Método findAll() debe ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado');
  }

  async save(recibo) {
    throw new Error('Método save() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }
}
