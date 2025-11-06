/**
 * Caso de uso: Obtener todas las personas
 */
export class GetAllPersonas {
  constructor(personaRepository) {
    this.personaRepository = personaRepository;
  }

  async execute() {
    return await this.personaRepository.findAll();
  }
}
