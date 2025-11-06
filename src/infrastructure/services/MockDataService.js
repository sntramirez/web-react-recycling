import usersData from '../../data/users.json';
import ventasDiariasData from '../../data/ventasDiarias.json';
import ventasMensualesData from '../../data/ventasMensuales.json';
import tendenciaPreciosData from '../../data/tendenciaPrecios.json';

/**
 * Servicio para simular llamadas a un backend
 * Utiliza datos mock de archivos JSON
 */
export class MockDataService {
  /**
   * Simula delay de red
   */
  static async simulateDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Autenticación de usuario
   */
  static async login(username, password) {
    await this.simulateDelay(800);

    const user = usersData.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // No retornar la contraseña
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Obtener ventas diarias
   */
  static async getVentasDiarias() {
    await this.simulateDelay(300);
    return ventasDiariasData;
  }

  /**
   * Obtener ventas mensuales
   */
  static async getVentasMensuales() {
    await this.simulateDelay(300);
    return ventasMensualesData;
  }

  /**
   * Obtener tendencia de precios
   */
  static async getTendenciaPrecios() {
    await this.simulateDelay(300);
    return tendenciaPreciosData;
  }

  /**
   * Obtener estadísticas generales
   */
  static async getEstadisticasGenerales() {
    await this.simulateDelay(400);

    const ventasDiarias = ventasDiariasData;
    const ventasMensuales = ventasMensualesData;

    // Calcular totales
    const totalVentasHoy = ventasDiarias[ventasDiarias.length - 1]?.totalVentas || 0;
    const totalVentasMes = ventasMensuales[ventasMensuales.length - 1]?.totalVentas || 0;
    const totalRecibosHoy = ventasDiarias[ventasDiarias.length - 1]?.cantidadRecibos || 0;
    const totalRecibosMes = ventasMensuales[ventasMensuales.length - 1]?.cantidadRecibos || 0;

    // Calcular peso total
    const pesoTotalHoy = ventasDiarias[ventasDiarias.length - 1]?.pesoTotal || 0;
    const pesoTotalMes = ventasMensuales[ventasMensuales.length - 1]?.pesoTotal || 0;

    // Calcular promedio diario del mes actual
    const promedioDiario = totalVentasMes / new Date().getDate();

    return {
      hoy: {
        ventas: totalVentasHoy,
        recibos: totalRecibosHoy,
        peso: pesoTotalHoy
      },
      mes: {
        ventas: totalVentasMes,
        recibos: totalRecibosMes,
        peso: pesoTotalMes
      },
      promedioDiario
    };
  }

  /**
   * Obtener materiales con mayor movimiento
   */
  static async getMaterialesTopVentas() {
    await this.simulateDelay(300);

    return [
      { material: 'Acero', cantidad: 1250.5, ventas: 19382.25 },
      { material: 'Cobre', cantidad: 145.8, ventas: 12393.00 },
      { material: 'Aluminio', cantidad: 380.2, ventas: 9505.00 },
      { material: 'Plástico PET', cantidad: 890.5, ventas: 7124.00 },
      { material: 'Bronce', cantidad: 98.3, ventas: 5406.50 }
    ];
  }
}
