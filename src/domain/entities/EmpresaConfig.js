/**
 * Entidad de dominio: EmpresaConfig
 * Representa la configuración de la empresa para documentos tributarios
 */
export class EmpresaConfig {
  constructor(data = {}) {
    this.id = data.id || '1';
    this.razonSocial = data.razonSocial || '';
    this.nombreComercial = data.nombreComercial || '';
    this.ruc = data.ruc || '';
    this.direccionMatriz = data.direccionMatriz || '';
    this.direccionSucursal = data.direccionSucursal || '';
    this.telefono = data.telefono || '';
    this.celular = data.celular || '';
    this.email = data.email || '';
    this.sitioWeb = data.sitioWeb || '';
    this.contribuyenteEspecial = data.contribuyenteEspecial || 'N/A';
    this.obligadoContabilidad = data.obligadoContabilidad || 'SI';
    this.agenteRetencion = data.agenteRetencion || 'NO';
    this.regimenMicroempresas = data.regimenMicroempresas || 'NO';
    this.actividadEconomica = data.actividadEconomica || '';
    this.codigoCIIU = data.codigoCIIU || '';
    this.representanteLegal = data.representanteLegal || '';
    this.cedulaRepresentante = data.cedulaRepresentante || '';
    this.ambienteSRI = data.ambienteSRI || 'PRODUCCIÓN';
    this.tipoEmision = data.tipoEmision || 'NORMAL';
    this.claveAccesoBase = data.claveAccesoBase || '12345678';
    this.establecimiento = data.establecimiento || '001';
    this.puntoEmision = data.puntoEmision || '001';
    this.secuencialActual = data.secuencialActual || 1;
    this.logo = data.logo || '';
    this.slogan = data.slogan || '';
    this.provincia = data.provincia || '';
    this.ciudad = data.ciudad || '';
    this.codigoPostal = data.codigoPostal || '';
    this.configuracionAdicional = data.configuracionAdicional || {
      iva: 12,
      retencionIVA: 30,
      retencionRenta: 1,
      formatoNumeroDocumento: 'GR-{YYYY}{MM}{DD}-{SECUENCIAL}',
      digitosSecuencial: 9
    };
  }

  /**
   * Valida que los campos obligatorios estén completos
   */
  esValida() {
    return !!(
      this.razonSocial &&
      this.ruc &&
      this.direccionMatriz &&
      this.email &&
      this.telefono
    );
  }

  /**
   * Obtiene el RUC sin guiones ni espacios
   */
  getRUCLimpio() {
    return this.ruc.replace(/[-\s]/g, '');
  }

  /**
   * Obtiene la dirección completa formateada
   */
  getDireccionCompleta() {
    let direccion = this.direccionMatriz;
    if (this.ciudad) direccion += `, ${this.ciudad}`;
    if (this.provincia) direccion += ` - ${this.provincia}`;
    return direccion;
  }

  /**
   * Incrementa el secuencial y retorna el nuevo valor
   */
  incrementarSecuencial() {
    this.secuencialActual += 1;
    return this.secuencialActual;
  }

  /**
   * Obtiene el secuencial formateado con ceros a la izquierda
   */
  getSecuencialFormateado() {
    const digitos = this.configuracionAdicional.digitosSecuencial || 9;
    return String(this.secuencialActual).padStart(digitos, '0');
  }

  /**
   * Convierte la entidad a un objeto plano para persistencia
   */
  toJSON() {
    return {
      id: this.id,
      razonSocial: this.razonSocial,
      nombreComercial: this.nombreComercial,
      ruc: this.ruc,
      direccionMatriz: this.direccionMatriz,
      direccionSucursal: this.direccionSucursal,
      telefono: this.telefono,
      celular: this.celular,
      email: this.email,
      sitioWeb: this.sitioWeb,
      contribuyenteEspecial: this.contribuyenteEspecial,
      obligadoContabilidad: this.obligadoContabilidad,
      agenteRetencion: this.agenteRetencion,
      regimenMicroempresas: this.regimenMicroempresas,
      actividadEconomica: this.actividadEconomica,
      codigoCIIU: this.codigoCIIU,
      representanteLegal: this.representanteLegal,
      cedulaRepresentante: this.cedulaRepresentante,
      ambienteSRI: this.ambienteSRI,
      tipoEmision: this.tipoEmision,
      claveAccesoBase: this.claveAccesoBase,
      establecimiento: this.establecimiento,
      puntoEmision: this.puntoEmision,
      secuencialActual: this.secuencialActual,
      logo: this.logo,
      slogan: this.slogan,
      provincia: this.provincia,
      ciudad: this.ciudad,
      codigoPostal: this.codigoPostal,
      configuracionAdicional: this.configuracionAdicional
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON(json) {
    return new EmpresaConfig(json);
  }
}
