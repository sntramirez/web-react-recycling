export class UpdateTransportista {
  constructor(transportistaRepository) {
    this.transportistaRepository = transportistaRepository;
  }

  async execute(id, updates) {
    const transportista = await this.transportistaRepository.findById(id);
    if (!transportista) {
      throw new Error('Transportista no encontrado');
    }

    if (updates.licencia && updates.licencia !== transportista.licencia) {
      const existente = await this.transportistaRepository.findByLicencia(updates.licencia);
      if (existente) {
        throw new Error('Ya existe un transportista registrado con esa licencia');
      }
    }

    transportista.actualizarDatos(updates);

    if (updates.activo !== undefined) {
      updates.activo ? transportista.activar() : transportista.desactivar();
    }

    await this.transportistaRepository.update(transportista);
    return transportista;
  }
}
