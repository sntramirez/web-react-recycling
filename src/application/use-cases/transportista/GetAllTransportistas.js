export class GetAllTransportistas {
  constructor(transportistaRepository) {
    this.transportistaRepository = transportistaRepository;
  }

  async execute() {
    return await this.transportistaRepository.findAll();
  }
}
