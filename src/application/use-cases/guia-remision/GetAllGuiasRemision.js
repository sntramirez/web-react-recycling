export class GetAllGuiasRemision {
  constructor(guiaRemisionRepository) {
    this.guiaRemisionRepository = guiaRemisionRepository;
  }

  async execute() {
    return await this.guiaRemisionRepository.findAll();
  }
}
