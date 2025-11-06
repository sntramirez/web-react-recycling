import { GuiaRemision } from '../../../domain/entities/GuiaRemision.js';

export class CreateGuiaRemision {
  constructor(guiaRemisionRepository, reciboRepository, transportistaRepository) {
    this.guiaRemisionRepository = guiaRemisionRepository;
    this.reciboRepository = reciboRepository;
    this.transportistaRepository = transportistaRepository;
  }

  async execute(guiaData) {
    // Validar que el recibo exista
    const recibo = await this.reciboRepository.findById(guiaData.reciboId);
    if (!recibo) {
      throw new Error('Recibo no encontrado');
    }

    // Validar que el transportista exista
    const transportista = await this.transportistaRepository.findById(guiaData.transportistaId);
    if (!transportista) {
      throw new Error('Transportista no encontrado');
    }

    if (!transportista.activo) {
      throw new Error('El transportista no está activo');
    }

    // Generar ID único
    const id = Date.now().toString();

    // Crear nueva entidad GuiaRemision
    const guia = new GuiaRemision(
      id,
      recibo.id,
      recibo.numeroRecibo,
      transportista.id,
      transportista.getNombreCompleto(),
      guiaData.placaVehiculo,
      guiaData.marcaVehiculo || '',
      guiaData.observaciones || ''
    );

    if (guiaData.fechaTraslado) {
      guia.actualizarFechaTraslado(guiaData.fechaTraslado);
    }

    // Persistir la guía
    await this.guiaRemisionRepository.save(guia);

    return { guia, recibo };
  }
}
