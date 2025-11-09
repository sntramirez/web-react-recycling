/**
 * Servicio para inicializar datos mock en LocalStorage
 * Carga datos de archivos JSON si no existen datos previos
 */

import materialesData from '../../data/materiales.json';
import personasData from '../../data/personas.json';
import transportistasData from '../../data/transportistas.json';
import recibosData from '../../data/recibos.json';
import guiasRemisionData from '../../data/guiasRemision.json';
import empresaConfigData from '../../data/empresaConfig.json';
import { Material } from '../../domain/entities/Material';
import { Persona } from '../../domain/entities/Persona';
import { Transportista } from '../../domain/entities/Transportista';
import { Recibo } from '../../domain/entities/Recibo';
import { GuiaRemision } from '../../domain/entities/GuiaRemision';
import { EmpresaConfig } from '../../domain/entities/EmpresaConfig';

export class DataInitializationService {
  static STORAGE_KEYS = {
    MATERIALES: 'materiales',
    PERSONAS: 'personas',
    TRANSPORTISTAS: 'transportistas',
    RECIBOS: 'recibos',
    GUIAS_REMISION: 'guiasRemision',
    EMPRESA_CONFIG: 'empresaConfig',
    INITIALIZED: 'dataInitialized',
    VERSION: 'dataVersion'
  };

  static CURRENT_VERSION = '1.0.0';

  /**
   * Verifica si los datos ya han sido inicializados
   */
  static isInitialized() {
    return localStorage.getItem(this.STORAGE_KEYS.INITIALIZED) === 'true';
  }

  /**
   * Verifica si la versión de datos es la actual
   */
  static isCurrentVersion() {
    return localStorage.getItem(this.STORAGE_KEYS.VERSION) === this.CURRENT_VERSION;
  }

  /**
   * Marca los datos como inicializados
   */
  static markAsInitialized() {
    localStorage.setItem(this.STORAGE_KEYS.INITIALIZED, 'true');
    localStorage.setItem(this.STORAGE_KEYS.VERSION, this.CURRENT_VERSION);
  }

  /**
   * Verifica si un tipo de dato existe y es válido
   */
  static hasValidData(key) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return false;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch (error) {
      console.error(`Error verificando ${key}:`, error);
      return false;
    }
  }

  /**
   * Inicializa todos los datos si no existen
   */
  static async initializeAllData(force = false) {
    console.log('🔄 Verificando datos mock...');

    // Si no es la versión actual, forzar reinicialización
    if (!this.isCurrentVersion()) {
      console.log('⚠️ Versión de datos desactualizada, reinicializando...');
      force = true;
    }

    try {
      // Verificar qué datos faltan
      const needsMateriales = force || !this.hasValidData(this.STORAGE_KEYS.MATERIALES);
      const needsPersonas = force || !this.hasValidData(this.STORAGE_KEYS.PERSONAS);
      const needsTransportistas = force || !this.hasValidData(this.STORAGE_KEYS.TRANSPORTISTAS);
      const needsRecibos = force || !this.hasValidData(this.STORAGE_KEYS.RECIBOS);
      const needsGuias = force || !this.hasValidData(this.STORAGE_KEYS.GUIAS_REMISION);
      const needsEmpresaConfig = force || !this.hasValidData(this.STORAGE_KEYS.EMPRESA_CONFIG);

      // Mostrar estado
      console.log('📊 Estado de datos:', {
        materiales: needsMateriales ? '❌ Faltan' : '✅ OK',
        personas: needsPersonas ? '❌ Faltan' : '✅ OK',
        transportistas: needsTransportistas ? '❌ Faltan' : '✅ OK',
        recibos: needsRecibos ? '❌ Faltan' : '✅ OK',
        guias: needsGuias ? '❌ Faltan' : '✅ OK',
        empresaConfig: needsEmpresaConfig ? '❌ Faltan' : '✅ OK'
      });

      // Inicializar solo lo que falta
      if (needsMateriales) await this.initializeMateriales();
      if (needsPersonas) await this.initializePersonas();
      if (needsTransportistas) await this.initializeTransportistas();
      if (needsRecibos) await this.initializeRecibos();
      if (needsGuias) await this.initializeGuiasRemision();
      if (needsEmpresaConfig) await this.initializeEmpresaConfig();

      this.markAsInitialized();
      console.log('✅ Datos mock verificados e inicializados exitosamente');
    } catch (error) {
      console.error('❌ Error al inicializar datos mock:', error);
      throw error;
    }
  }

  /**
   * Inicializa materiales
   */
  static async initializeMateriales() {
    console.log('📦 Inicializando materiales...');

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
    console.log(`  ✓ ${materiales.length} materiales inicializados`);
  }

  /**
   * Inicializa personas/vendedores
   */
  static async initializePersonas() {
    console.log('👥 Inicializando personas...');

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
    console.log(`  ✓ ${personas.length} personas inicializadas`);
  }

  /**
   * Inicializa transportistas
   */
  static async initializeTransportistas() {
    console.log('🚚 Inicializando transportistas...');

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
    console.log(`  ✓ ${transportistas.length} transportistas inicializados`);
  }

  /**
   * Inicializa recibos
   */
  static async initializeRecibos() {
    console.log('📝 Inicializando recibos...');

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
    console.log(`  ✓ ${recibos.length} recibos inicializados`);
  }

  /**
   * Inicializa guías de remisión
   */
  static async initializeGuiasRemision() {
    console.log('📋 Inicializando guías de remisión...');

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
    console.log(`  ✓ ${guias.length} guías de remisión inicializadas`);
  }

  /**
   * Inicializa configuración de empresa
   */
  static async initializeEmpresaConfig() {
    console.log("🏢 Inicializando configuración de empresa...");

    const empresaConfig = new EmpresaConfig(empresaConfigData);
    localStorage.setItem(
      this.STORAGE_KEYS.EMPRESA_CONFIG,
      JSON.stringify(empresaConfig.toJSON())
    );
    console.log(`  ✓ Configuración de empresa inicializada`);
  }

  /**
   * Limpia todos los datos (útil para testing o reset)
   */
  static clearAllData() {
    console.log('🗑️ Limpiando todos los datos...');
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('  ✓ Todos los datos eliminados');
  }

  /**
   * Reinicializa todos los datos (limpia y vuelve a cargar)
   */
  static async reinitializeAllData() {
    console.log('🔄 Reinicializando todos los datos...');
    this.clearAllData();
    await this.initializeAllData(true);
    console.log('  ✓ Datos reinicializados completamente');
  }
}
