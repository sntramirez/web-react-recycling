export class DeleteTransportista {
  constructor(transportistaRepository) {
    this.transportistaRepository = transportistaRepository;
  }

  async execute(id) {
    const transportista = await this.transportistaRepository.findById(id);
    if (!transportista) {
      throw new Error('Transportista no encontrado');
    }

    await this.transportistaRepository.delete(id);
    return true;
  }
}
