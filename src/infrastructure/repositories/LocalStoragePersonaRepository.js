import { PersonaRepository } from '../../domain/repositories/PersonaRepository.js';
import { Persona } from '../../domain/entities/Persona.js';
import { LocalStorageService } from '../persistence/LocalStorageService.js';

/**
 * Implementación del repositorio de Persona usando LocalStorage
 */
export class LocalStoragePersonaRepository extends PersonaRepository {
  constructor() {
    super();
    this.storage = new LocalStorageService('personas');
  }

  async findAll() {
    const personasData = this.storage.getAll();
    return personasData.map(data => Persona.fromJSON(data));
  }

  async findById(id) {
    const personaData = this.storage.getById(id);
    return personaData ? Persona.fromJSON(personaData) : null;
  }

  async findByDocumento(documentoIdentidad) {
    const personas = this.storage.getAll();
    const personaData = personas.find(p => p.documentoIdentidad === documentoIdentidad);
    return personaData ? Persona.fromJSON(personaData) : null;
  }

  async save(persona) {
    this.storage.save(persona.toJSON());
    return persona;
  }

  async update(persona) {
    this.storage.update(persona.toJSON());
    return persona;
  }

  async delete(id) {
    return this.storage.delete(id);
  }
}
