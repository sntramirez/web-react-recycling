import { ReciboRepository } from '../../domain/repositories/ReciboRepository.js';
import { Recibo } from '../../domain/entities/Recibo.js';
import { LocalStorageService } from '../persistence/LocalStorageService.js';

/**
 * Implementación del repositorio de Recibo usando LocalStorage
 */
export class LocalStorageReciboRepository extends ReciboRepository {
  constructor() {
    super();
    this.storage = new LocalStorageService('recibos');
  }

  async findAll() {
    const recibosData = this.storage.getAll();
    return recibosData.map(data => Recibo.fromJSON(data));
  }

  async findById(id) {
    const reciboData = this.storage.getById(id);
    return reciboData ? Recibo.fromJSON(reciboData) : null;
  }

  async save(recibo) {
    this.storage.save(recibo.toJSON());
    return recibo;
  }

  async delete(id) {
    return this.storage.delete(id);
  }
}
