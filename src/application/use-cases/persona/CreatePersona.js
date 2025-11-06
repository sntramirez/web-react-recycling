import { Persona } from '../../../domain/entities/Persona.js';

/**
 * Caso de uso: Crear Persona
 */
export class CreatePersona {
  constructor(personaRepository) {
    this.personaRepository = personaRepository;
  }

  async execute(personaData) {
    // Verificar si ya existe una persona con ese documento
    const existente = await this.personaRepository.findByDocumento(personaData.documentoIdentidad);
    if (existente) {
      throw new Error('Ya existe una persona registrada con ese documento de identidad');
    }

    // Generar ID único
    const id = Date.now().toString();

    // Crear nueva entidad Persona
    const persona = new Persona(
      id,
      personaData.nombre,
      personaData.apellido,
      personaData.telefono,
      personaData.direccion,
      personaData.documentoIdentidad,
      true
    );

    // Persistir la persona
    await this.personaRepository.save(persona);

    return persona;
  }
}
