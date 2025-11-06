/**
 * Interfaz del repositorio de Transportista
 */
export class TransportistaRepository {
  async findAll() {
    throw new Error('Método findAll() debe ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado');
  }

  async findByLicencia(licencia) {
    throw new Error('Método findByLicencia() debe ser implementado');
  }

  async save(transportista) {
    throw new Error('Método save() debe ser implementado');
  }

  async update(transportista) {
    throw new Error('Método update() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }
}
