# Sistema de Administración de Centro de Reciclaje

Aplicación web desarrollada en React con arquitectura limpia para la gestión de un centro de compra de materiales de reciclaje.

## Características

- ✅ Gestión completa de materiales de reciclaje (CRUD)
- ✅ Configuración de precios por kilogramo para cada material
- ✅ Generación de recibos de compra
- ✅ Vista previa e impresión de recibos
- ✅ Interfaz responsive y moderna
- ✅ Persistencia de datos con LocalStorage
- ✅ Arquitectura limpia y componentes reutilizables

## Tecnologías Utilizadas

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **JavaScript (ES6+)** - Lenguaje de programación
- **CSS3** - Estilos
- **LocalStorage** - Persistencia de datos

## Arquitectura del Proyecto

El proyecto sigue los principios de **Arquitectura Limpia** (Clean Architecture):

```
src/
├── domain/                 # Capa de Dominio
│   ├── entities/          # Entidades de negocio (Material, Recibo, ReciboItem)
│   └── repositories/      # Interfaces de repositorios
│
├── application/           # Capa de Aplicación
│   └── use-cases/        # Casos de uso (lógica de aplicación)
│       ├── material/     # CRUD de materiales
│       └── recibo/       # Gestión de recibos
│
├── infrastructure/        # Capa de Infraestructura
│   ├── persistence/      # Servicios de persistencia
│   └── repositories/     # Implementaciones de repositorios
│
└── presentation/         # Capa de Presentación
    ├── components/       # Componentes React
    │   ├── common/      # Componentes reutilizables
    │   └── features/    # Componentes específicos
    ├── pages/           # Páginas de la aplicación
    └── context/         # Context API para DI
```

## Instalación y Configuración

### Prerrequisitos

- Node.js 16+
- npm o yarn

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd web-react-recycling
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir el navegador en `http://localhost:5173`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

## Funcionalidades Principales

### Gestión de Materiales

- **Crear Material**: Agregar nuevos tipos de materiales con precio por kg
- **Editar Material**: Modificar nombre, precio o unidad de medida
- **Activar/Desactivar**: Control de disponibilidad de materiales
- **Eliminar Material**: Remover materiales del sistema

Materiales incluidos por defecto:
- Acero ($15.50/kg)
- Cartón ($2.00/kg)
- Plástico PET ($8.00/kg)
- Aluminio ($25.00/kg)
- Vidrio ($1.50/kg)
- Papel ($1.80/kg)
- Cobre ($85.00/kg)
- Bronce ($55.00/kg)

### Generación de Recibos

1. **Crear Recibo**:
   - Ingresar nombre del cliente
   - Seleccionar materiales y cantidades (peso)
   - Sistema calcula automáticamente subtotales y total

2. **Vista Previa**:
   - Visualizar recibo formateado
   - Información completa: número, fecha, cliente, materiales, totales

3. **Impresión**:
   - Formato optimizado para impresoras térmicas (80mm)
   - Compatible con impresoras de red
   - Diseño profesional tipo ticket

### Historial de Recibos

- Visualizar todos los recibos generados
- Estadísticas: total de recibos y monto total pagado
- Reimprimir recibos anteriores

## Estructura de Datos

### Material
```javascript
{
  id: string,
  nombre: string,
  precioPorKg: number,
  unidad: string,
  activo: boolean,
  fechaCreacion: Date,
  fechaActualizacion: Date
}
```

### Recibo
```javascript
{
  id: string,
  numeroRecibo: string,
  nombreCliente: string,
  items: ReciboItem[],
  fechaEmision: Date,
  total: number
}
```

### ReciboItem
```javascript
{
  materialId: string,
  nombreMaterial: string,
  precioPorKg: number,
  peso: number,
  unidad: string,
  subtotal: number
}
```

## Principios de Diseño

- **Clean Architecture**: Separación clara de responsabilidades
- **SOLID**: Principios de diseño orientado a objetos
- **DRY**: Reutilización de componentes
- **Separation of Concerns**: Cada capa tiene su responsabilidad
- **Dependency Injection**: Mediante Context API

## Componentes Reutilizables

- `Button` - Botones con variantes y tamaños
- `Input` - Campos de entrada con validación
- `Card` - Tarjetas con header y acciones
- `Table` - Tablas responsivas con datos
- `Modal` - Modales con overlay

## Impresión de Recibos

La aplicación incluye funcionalidad de impresión optimizada para:

- **Impresoras Térmicas**: Formato de 80mm
- **Impresoras de Red**: Compatible con impresoras compartidas
- **Impresoras Locales**: Vía diálogo de impresión del navegador

El recibo impreso incluye:
- Encabezado del centro de reciclaje
- Número de recibo único
- Fecha y hora de emisión
- Nombre del cliente
- Detalle de materiales (peso, precio, subtotal)
- Peso total y monto total a pagar
- Mensaje ecológico

## Persistencia de Datos

Los datos se almacenan en **LocalStorage** del navegador:

- `materiales` - Lista de materiales
- `recibos` - Historial de recibos

**Nota**: Los datos persisten entre sesiones pero son específicos del navegador.

## Mejoras Futuras

- [ ] Backend con API REST
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Autenticación y roles de usuario
- [ ] Reportes y estadísticas avanzadas
- [ ] Exportación a PDF/Excel
- [ ] Múltiples sucursales
- [ ] Dashboard con gráficos
- [ ] Notificaciones
- [ ] Búsqueda y filtros avanzados

## Licencia

Este proyecto fue desarrollado con fines educativos y de demostración.

## Soporte

Para reportar problemas o sugerencias, crear un issue en el repositorio.
