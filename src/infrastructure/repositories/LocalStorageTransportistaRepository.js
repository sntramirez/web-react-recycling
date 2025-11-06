import { TransportistaRepository } from '../../domain/repositories/TransportistaRepository.js';
import { Transportista } from '../../domain/entities/Transportista.js';
import { LocalStorageService } from '../persistence/LocalStorageService.js';

export class LocalStorageTransportistaRepository extends TransportistaRepository {
  constructor() {
    super();
    this.storage = new LocalStorageService('transportistas');
  }

  async findAll() {
    const transportistasData = this.storage.getAll();
    return transportistasData.map(data => Transportista.fromJSON(data));
  }

  async findById(id) {
    const transportistaData = this.storage.getById(id);
    return transportistaData ? Transportista.fromJSON(transportistaData) : null;
  }

  async findByLicencia(licencia) {
    const transportistas = this.storage.getAll();
    const transportistaData = transportistas.find(t => t.licencia === licencia);
    return transportistaData ? Transportista.fromJSON(transportistaData) : null;
  }

  async save(transportista) {
    this.storage.save(transportista.toJSON());
    return transportista;
  }

  async update(transportista) {
    this.storage.update(transportista.toJSON());
    return transportista;
  }

  async delete(id) {
    return this.storage.delete(id);
  }
}
