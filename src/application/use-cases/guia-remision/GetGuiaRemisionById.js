export class GetGuiaRemisionById {
  constructor(guiaRemisionRepository) {
    this.guiaRemisionRepository = guiaRemisionRepository;
  }

  async execute(id) {
    const guia = await this.guiaRemisionRepository.findById(id);
    if (!guia) {
      throw new Error('Guía de remisión no encontrada');
    }
    return guia;
  }
}
