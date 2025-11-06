/**
 * Caso de uso: Obtener todos los recibos
 */
export class GetAllRecibos {
  constructor(reciboRepository) {
    this.reciboRepository = reciboRepository;
  }

  async execute() {
    return await this.reciboRepository.findAll();
  }
}
