/**
 * Caso de uso: Actualizar Persona
 */
export class UpdatePersona {
  constructor(personaRepository) {
    this.personaRepository = personaRepository;
  }

  async execute(id, updates) {
    // Obtener la persona existente
    const persona = await this.personaRepository.findById(id);

    if (!persona) {
      throw new Error('Persona no encontrada');
    }

    // Si se intenta cambiar el documento, verificar que no exista
    if (updates.documentoIdentidad && updates.documentoIdentidad !== persona.documentoIdentidad) {
      const existente = await this.personaRepository.findByDocumento(updates.documentoIdentidad);
      if (existente) {
        throw new Error('Ya existe una persona registrada con ese documento de identidad');
      }
    }

    // Actualizar propiedades
    persona.actualizarDatos(updates);

    // Manejar activación/desactivación
    if (updates.activo !== undefined) {
      if (updates.activo) {
        persona.activar();
      } else {
        persona.desactivar();
      }
    }

    // Persistir cambios
    await this.personaRepository.update(persona);

    return persona;
  }
}
