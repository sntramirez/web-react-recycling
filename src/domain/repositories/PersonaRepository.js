/**
 * Interfaz del repositorio de Persona
 * Define el contrato para la persistencia de personas/vendedores
 */
export class PersonaRepository {
  async findAll() {
    throw new Error('Método findAll() debe ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado');
  }

  async findByDocumento(documentoIdentidad) {
    throw new Error('Método findByDocumento() debe ser implementado');
  }

  async save(persona) {
    throw new Error('Método save() debe ser implementado');
  }

  async update(persona) {
    throw new Error('Método update() debe ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado');
  }
}
