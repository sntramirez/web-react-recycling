/**
 * Servicio para inicializar datos mock en LocalStorage
 * Carga datos de archivos JSON si no existen datos previos
 */

import materialesData from '../../data/materiales.json';
import personasData from '../../data/personas.json';
import transportistasData from '../../data/transportistas.json';
import recibosData from '../../data/recibos.json';
import guiasRemisionData from '../../data/guiasRemision.json';
import { Material } from '../../domain/entities/Material';
import { Persona } from '../../domain/entities/Persona';
import { Transportista } from '../../domain/entities/Transportista';
import { Recibo } from '../../domain/entities/Recibo';
import { GuiaRemision } from '../../domain/entities/GuiaRemision';

export class DataInitializationService {
  static STORAGE_KEYS = {
    MATERIALES: 'materiales',
    PERSONAS: 'personas',
    TRANSPORTISTAS: 'transportistas',
    RECIBOS: 'recibos',
    GUIAS_REMISION: 'guiasRemision',
    INITIALIZED: 'dataInitialized'
  };

  /**
   * Verifica si los datos ya han sido inicializados
   */
  static isInitialized() {
    return localStorage.getItem(this.STORAGE_KEYS.INITIALIZED) === 'true';
  }

  /**
   * Marca los datos como inicializados
   */
  static markAsInitialized() {
    localStorage.setItem(this.STORAGE_KEYS.INITIALIZED, 'true');
  }

  /**
   * Inicializa todos los datos si no existen
   */
  static async initializeAllData() {
    console.log('Verificando e inicializando datos mock...');

    try {
      // Inicializa cada tipo de dato individualmente
      // Cada método verifica si ya existen datos antes de inicializar
      await this.initializeMateriales();
      await this.initializePersonas();
      await this.initializeTransportistas();
      await this.initializeRecibos();
      await this.initializeGuiasRemision();

      this.markAsInitialized();
      console.log('Datos mock verificados e inicializados exitosamente');
    } catch (error) {
      console.error('Error al inicializar datos mock:', error);
      throw error;
    }
  }

  /**
   * Inicializa materiales
   */
  static async initializeMateriales() {
    const existing = localStorage.getItem(this.STORAGE_KEYS.MATERIALES);
    if (existing && JSON.parse(existing).length > 0) {
      console.log('Materiales ya existen en LocalStorage');
      return;
    }

    const materiales = materialesData.map(data => {
      const material = new Material(
        data.id,
        data.nombre,
        data.precioPorKg,
        data.activo
      );
      material.fechaCreacion = new Date(data.fechaCreacion);
      material.fechaActualizacion = new Date(data.fechaActualizacion);
      return material;
    });

    localStorage.setItem(
      this.STORAGE_KEYS.MATERIALES,
      JSON.stringify(materiales.map(m => m.toJSON()))
    );
    console.log(`${materiales.length} materiales inicializados`);
  }

  /**
   * Inicializa personas/vendedores
   */
  static async initializePersonas() {
    const existing = localStorage.getItem(this.STORAGE_KEYS.PERSONAS);
    if (existing && JSON.parse(existing).length > 0) {
      console.log('Personas ya existen en LocalStorage');
      return;
    }

    const personas = personasData.map(data => {
      const persona = new Persona(
        data.id,
        data.nombre,
        data.apellido,
        data.documentoIdentidad,
        data.telefono,
        data.direccion,
        data.activo
      );
      persona.fechaRegistro = new Date(data.fechaRegistro);
      persona.fechaActualizacion = new Date(data.fechaActualizacion);
      return persona;
    });

    localStorage.setItem(
      this.STORAGE_KEYS.PERSONAS,
      JSON.stringify(personas.map(p => p.toJSON()))
    );
    console.log(`${personas.length} personas inicializadas`);
  }

  /**
   * Inicializa transportistas
   */
  static async initializeTransportistas() {
    const existing = localStorage.getItem(this.STORAGE_KEYS.TRANSPORTISTAS);
    if (existing && JSON.parse(existing).length > 0) {
      console.log('Transportistas ya existen en LocalStorage');
      return;
    }

    const transportistas = transportistasData.map(data => {
      const transportista = new Transportista(
        data.id,
        data.nombre,
        data.apellido,
        data.licencia,
        data.telefono,
        data.empresa,
        data.activo
      );
      transportista.fechaRegistro = new Date(data.fechaRegistro);
      transportista.fechaActualizacion = new Date(data.fechaActualizacion);
      return transportista;
    });

    localStorage.setItem(
      this.STORAGE_KEYS.TRANSPORTISTAS,
      JSON.stringify(transportistas.map(t => t.toJSON()))
    );
    console.log(`${transportistas.length} transportistas inicializados`);
  }

  /**
   * Inicializa recibos
   */
  static async initializeRecibos() {
    const existing = localStorage.getItem(this.STORAGE_KEYS.RECIBOS);
    if (existing && JSON.parse(existing).length > 0) {
      console.log('Recibos ya existen en LocalStorage');
      return;
    }

    const recibos = recibosData.map(data => {
      const recibo = new Recibo(
        data.id,
        data.nombreCliente,
        data.personaId,
        data.personaNombre
      );
      recibo.numeroRecibo = data.numeroRecibo;
      recibo.items = data.items;
      recibo.fechaEmision = new Date(data.fechaEmision);
      recibo.total = data.total;
      return recibo;
    });

    localStorage.setItem(
      this.STORAGE_KEYS.RECIBOS,
      JSON.stringify(recibos.map(r => r.toJSON()))
    );
    console.log(`${recibos.length} recibos inicializados`);
  }

  /**
   * Inicializa guías de remisión
   */
  static async initializeGuiasRemision() {
    const existing = localStorage.getItem(this.STORAGE_KEYS.GUIAS_REMISION);
    if (existing && JSON.parse(existing).length > 0) {
      console.log('Guías de remisión ya existen en LocalStorage');
      return;
    }

    const guias = guiasRemisionData.map(data => {
      const guia = new GuiaRemision(
        data.id,
        data.reciboId,
        data.numeroRecibo,
        data.transportistaId,
        data.transportistaNombre,
        data.placaVehiculo,
        data.marcaVehiculo,
        data.observaciones
      );
      guia.numeroGuia = data.numeroGuia;
      guia.fechaEmision = new Date(data.fechaEmision);
      guia.fechaTraslado = new Date(data.fechaTraslado);
      return guia;
    });

    localStorage.setItem(
      this.STORAGE_KEYS.GUIAS_REMISION,
      JSON.stringify(guias.map(g => g.toJSON()))
    );
    console.log(`${guias.length} guías de remisión inicializadas`);
  }

  /**
   * Limpia todos los datos (útil para testing o reset)
   */
  static clearAllData() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('Todos los datos han sido eliminados de LocalStorage');
  }

  /**
   * Reinicializa todos los datos (limpia y vuelve a cargar)
   */
  static async reinitializeAllData() {
    this.clearAllData();
    await this.initializeAllData();
  }
}
