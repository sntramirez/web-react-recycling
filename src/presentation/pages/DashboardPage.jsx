import { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { MockDataService } from '../../infrastructure/services/MockDataService';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './DashboardPage.css';

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [tendenciaPrecios, setTendenciaPrecios] = useState([]);
  const [materialesTop, setMaterialesTop] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [stats, diarias, mensuales, precios, top] = await Promise.all([
        MockDataService.getEstadisticasGenerales(),
        MockDataService.getVentasDiarias(),
        MockDataService.getVentasMensuales(),
        MockDataService.getTendenciaPrecios(),
        MockDataService.getMaterialesTopVentas()
      ]);

      setEstadisticas(stats);
      setVentasDiarias(diarias);
      setVentasMensuales(mensuales.slice(-6)); // Últimos 6 meses
      setTendenciaPrecios(precios);
      setMaterialesTop(top);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'];

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-dashboard">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Estadísticas y análisis de ventas</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#e8f5e9' }}>
            💰
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Ventas Hoy</span>
            <span className="kpi-value">{formatCurrency(estadisticas.hoy.ventas)}</span>
            <span className="kpi-detail">{estadisticas.hoy.recibos} recibos</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#e3f2fd' }}>
            📊
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Ventas del Mes</span>
            <span className="kpi-value">{formatCurrency(estadisticas.mes.ventas)}</span>
            <span className="kpi-detail">{estadisticas.mes.recibos} recibos</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fff3e0' }}>
            📈
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Promedio Diario</span>
            <span className="kpi-value">{formatCurrency(estadisticas.promedioDiario)}</span>
            <span className="kpi-detail">Este mes</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fce4ec' }}>
            ⚖️
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Peso Total Mes</span>
            <span className="kpi-value">{estadisticas.mes.peso.toFixed(2)} kg</span>
            <span className="kpi-detail">Material procesado</span>
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="charts-grid">
        {/* Ventas Diarias */}
        <Card title="Ventas Diarias - Última Semana">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ventasDiarias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="fecha"
                  tickFormatter={formatDate}
                  style={{ fontSize: 12 }}
                />
                <YAxis style={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={formatDate}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="totalVentas"
                  name="Ventas"
                  stroke="#4CAF50"
                  fill="#4CAF50"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Ventas Mensuales */}
        <Card title="Ventas Mensuales - Últimos 6 Meses">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasMensuales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" style={{ fontSize: 12 }} />
                <YAxis style={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="totalVentas" name="Ventas" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tendencia de Precios y Top Materiales */}
      <div className="charts-grid">
        {/* Top 5 Materiales */}
        <Card title="Top 5 Materiales - Este Mes">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={materialesTop}
                  dataKey="ventas"
                  nameKey="material"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ material, ventas }) => `${material}: ${formatCurrency(ventas)}`}
                >
                  {materialesTop.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lista de Tendencias */}
        <Card title="Tendencia de Precios - Últimas 6 Semanas">
          <div className="tendencias-list">
            {tendenciaPrecios.map((item, index) => (
              <div key={index} className="tendencia-item">
                <div className="tendencia-header">
                  <span className="tendencia-material">{item.material}</span>
                  <span className={`tendencia-badge tendencia-${item.tendencia}`}>
                    {item.tendencia === 'alza' && '📈 '}
                    {item.tendencia === 'baja' && '📉 '}
                    {item.tendencia === 'estable' && '➡️ '}
                    {item.cambio > 0 ? '+' : ''}{item.cambio.toFixed(1)}%
                  </span>
                </div>
                <div className="tendencia-chart">
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={item.historico}>
                      <Line
                        type="monotone"
                        dataKey="precio"
                        stroke={
                          item.tendencia === 'alza' ? '#4CAF50' :
                          item.tendencia === 'baja' ? '#F44336' : '#757575'
                        }
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="tendencia-precio">
                  Precio actual: <strong>{formatCurrency(item.historico[item.historico.length - 1].precio)}/kg</strong>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
