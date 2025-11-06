/**
 * Caso de uso: Obtener recibo por ID
 */
export class GetReciboById {
  constructor(reciboRepository) {
    this.reciboRepository = reciboRepository;
  }

  async execute(id) {
    const recibo = await this.reciboRepository.findById(id);

    if (!recibo) {
      throw new Error('Recibo no encontrado');
    }

    return recibo;
  }
}
