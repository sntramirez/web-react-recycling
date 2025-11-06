/**
 * Caso de uso: Eliminar Persona
 */
export class DeletePersona {
  constructor(personaRepository) {
    this.personaRepository = personaRepository;
  }

  async execute(id) {
    const persona = await this.personaRepository.findById(id);

    if (!persona) {
      throw new Error('Persona no encontrada');
    }

    await this.personaRepository.delete(id);

    return true;
  }
}
