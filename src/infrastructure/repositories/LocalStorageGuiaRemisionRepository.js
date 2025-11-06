import { GuiaRemisionRepository } from '../../domain/repositories/GuiaRemisionRepository.js';
import { GuiaRemision } from '../../domain/entities/GuiaRemision.js';
import { LocalStorageService } from '../persistence/LocalStorageService.js';

export class LocalStorageGuiaRemisionRepository extends GuiaRemisionRepository {
  constructor() {
    super();
    this.storage = new LocalStorageService('guiasRemision');
  }

  async findAll() {
    const guiasData = this.storage.getAll();
    return guiasData.map(data => GuiaRemision.fromJSON(data));
  }

  async findById(id) {
    const guiaData = this.storage.getById(id);
    return guiaData ? GuiaRemision.fromJSON(guiaData) : null;
  }

  async findByReciboId(reciboId) {
    const guias = this.storage.getAll();
    const guiaData = guias.find(g => g.reciboId === reciboId);
    return guiaData ? GuiaRemision.fromJSON(guiaData) : null;
  }

  async save(guiaRemision) {
    this.storage.save(guiaRemision.toJSON());
    return guiaRemision;
  }

  async delete(id) {
    return this.storage.delete(id);
  }
}
