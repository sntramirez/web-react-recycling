import { Transportista } from '../../../domain/entities/Transportista.js';

export class CreateTransportista {
  constructor(transportistaRepository) {
    this.transportistaRepository = transportistaRepository;
  }

  async execute(transportistaData) {
    const existente = await this.transportistaRepository.findByLicencia(transportistaData.licencia);
    if (existente) {
      throw new Error('Ya existe un transportista registrado con esa licencia');
    }

    const id = Date.now().toString();
    const transportista = new Transportista(
      id,
      transportistaData.nombre,
      transportistaData.apellido,
      transportistaData.licencia,
      transportistaData.telefono,
      transportistaData.empresa || '',
      true
    );

    await this.transportistaRepository.save(transportista);
    return transportista;
  }
}
