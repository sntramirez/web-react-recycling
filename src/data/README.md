# Datos Mock - Centro de Reciclaje

Este directorio contiene datos de prueba en formato JSON que simulan las respuestas de un backend. Los datos se cargan automáticamente en LocalStorage cuando la aplicación inicia por primera vez.

## Archivos de Datos

### 1. `materiales.json`
Contiene 10 materiales reciclables con sus precios por kilogramo.

**Estructura:**
```json
{
  "id": "string",
  "nombre": "string",
  "precioPorKg": number,
  "activo": boolean,
  "fechaCreacion": "ISO 8601 timestamp",
  "fechaActualizacion": "ISO 8601 timestamp"
}
```

**Materiales incluidos:**
- Acero (S/ 2.50/kg)
- Cartón (S/ 0.80/kg)
- Plástico PET (S/ 1.20/kg)
- Aluminio (S/ 3.50/kg)
- Cobre (S/ 12.00/kg)
- Papel Blanco (S/ 0.60/kg)
- Vidrio (S/ 0.30/kg)
- Bronce (S/ 8.50/kg)
- Plástico HDPE (S/ 1.00/kg)
- Fierro (S/ 1.80/kg)

### 2. `personas.json`
Contiene 8 personas/vendedores que venden material reciclable.

**Estructura:**
```json
{
  "id": "string",
  "nombre": "string",
  "apellido": "string",
  "documentoIdentidad": "string",
  "telefono": "string",
  "direccion": "string",
  "activo": boolean,
  "fechaRegistro": "ISO 8601 timestamp",
  "fechaActualizacion": "ISO 8601 timestamp"
}
```

**Personas incluidas:**
- Juan Pérez García (DNI: 43256789)
- María López Rodríguez (DNI: 40123456)
- Carlos Sánchez Mendoza (DNI: 45678901)
- Rosa Torres Vega (DNI: 42789012)
- Luis Ramírez Castro (DNI: 41234567)
- Ana Flores Díaz (DNI: 44567890)
- Pedro Gutiérrez Rojas (DNI: 46890123) - **Inactivo**
- Carmen Vargas Silva (DNI: 43890456)

### 3. `transportistas.json`
Contiene 6 transportistas con sus licencias de conducir.

**Estructura:**
```json
{
  "id": "string",
  "nombre": "string",
  "apellido": "string",
  "licencia": "string",
  "telefono": "string",
  "empresa": "string",
  "activo": boolean,
  "fechaRegistro": "ISO 8601 timestamp",
  "fechaActualizacion": "ISO 8601 timestamp"
}
```

**Transportistas incluidos:**
- Roberto Chávez Morales (Lic: Q43256789) - Transportes Rápidos SAC
- Miguel Fernández Luna (Lic: Q40987654) - Logística Express EIRL
- Jorge Quispe Huamán (Lic: Q42567890) - Independiente
- Alberto Rojas Villanueva (Lic: Q45123678) - Transporte Nacional SA
- Raúl Mendoza Campos (Lic: Q41678234) - Independiente
- Fernando García Prado (Lic: Q44890123) - Cargo Perú SAC - **Inactivo**

### 4. `recibos.json`
Contiene 10 recibos de compra de materiales reciclables.

**Estructura:**
```json
{
  "id": "string",
  "numeroRecibo": "string",
  "nombreCliente": "string",
  "personaId": "string",
  "personaNombre": "string",
  "items": [
    {
      "materialId": "string",
      "nombreMaterial": "string",
      "peso": number,
      "precioUnitario": number,
      "subtotal": number
    }
  ],
  "fechaEmision": "ISO 8601 timestamp",
  "total": number
}
```

**Recibos incluidos:**
- REC-20250128-0001 hasta REC-20250205-0010
- Fechas: del 28 de enero al 5 de febrero de 2025
- Totales: desde S/ 141.00 hasta S/ 428.00

### 5. `guiasRemision.json`
Contiene 10 guías de remisión vinculadas a los recibos.

**Estructura:**
```json
{
  "id": "string",
  "numeroGuia": "string",
  "reciboId": "string",
  "numeroRecibo": "string",
  "transportistaId": "string",
  "transportistaNombre": "string",
  "placaVehiculo": "string",
  "marcaVehiculo": "string",
  "fechaEmision": "ISO 8601 timestamp",
  "fechaTraslado": "ISO 8601 timestamp",
  "observaciones": "string"
}
```

**Guías incluidas:**
- GR-20250128-0001 hasta GR-20250205-0010
- Cada guía está vinculada a un recibo específico
- Transportistas rotan entre las diferentes guías

## Relaciones entre Datos

### Recibos → Personas
Cada recibo está asociado a una persona (vendedor) mediante:
- `recibo.personaId` → `persona.id`
- `recibo.personaNombre` → `persona.nombre + persona.apellido`

### Recibos → Materiales
Cada item de un recibo referencia un material mediante:
- `item.materialId` → `material.id`
- `item.nombreMaterial` → `material.nombre`
- `item.precioUnitario` → `material.precioPorKg` (al momento de la transacción)

### Guías de Remisión → Recibos
Cada guía está asociada a un recibo mediante:
- `guia.reciboId` → `recibo.id`
- `guia.numeroRecibo` → `recibo.numeroRecibo`

### Guías de Remisión → Transportistas
Cada guía está asociada a un transportista mediante:
- `guia.transportistaId` → `transportista.id`
- `guia.transportistaNombre` → `transportista.nombre + transportista.apellido`

## Inicialización de Datos

Los datos se cargan automáticamente mediante el `DataInitializationService` cuando:
1. La aplicación se inicia por primera vez
2. No existen datos previos en LocalStorage
3. Se llama manualmente a `DataInitializationService.reinitializeAllData()`

## Limpiar y Reinicializar

Para limpiar todos los datos y volver a cargar los datos mock:

```javascript
// En la consola del navegador
import { DataInitializationService } from './infrastructure/services/DataInitializationService';

// Limpiar todos los datos
DataInitializationService.clearAllData();

// Reinicializar con datos mock
DataInitializationService.reinitializeAllData();
```

## Formato para Backend

Todos los JSON están estructurados siguiendo las mejores prácticas REST:
- IDs como strings (facilita UUID en el futuro)
- Fechas en formato ISO 8601
- Relaciones mediante IDs y datos desnormalizados (nombreCompleto, etc.)
- Campos de auditoría (fechaCreacion, fechaActualizacion, fechaRegistro)
- Estados booleanos (activo)

## Endpoints Sugeridos para Backend

```
GET    /api/materiales          - Listar materiales
POST   /api/materiales          - Crear material
PUT    /api/materiales/:id      - Actualizar material
DELETE /api/materiales/:id      - Eliminar material

GET    /api/personas            - Listar personas
POST   /api/personas            - Crear persona
PUT    /api/personas/:id        - Actualizar persona
DELETE /api/personas/:id        - Eliminar persona

GET    /api/transportistas      - Listar transportistas
POST   /api/transportistas      - Crear transportista
PUT    /api/transportistas/:id  - Actualizar transportista
DELETE /api/transportistas/:id  - Eliminar transportista

GET    /api/recibos             - Listar recibos
POST   /api/recibos             - Crear recibo
GET    /api/recibos/:id         - Obtener recibo

GET    /api/guias-remision      - Listar guías
POST   /api/guias-remision      - Crear guía
GET    /api/guias-remision/:id  - Obtener guía

GET    /api/dashboard/ventas-diarias    - Estadísticas diarias
GET    /api/dashboard/ventas-mensuales  - Estadísticas mensuales
GET    /api/dashboard/tendencia-precios - Tendencias de precios
```

## Notas Importantes

1. **Consistencia de Datos**: Los datos están relacionados coherentemente. Si modificas un recibo, considera actualizar las guías relacionadas.

2. **Fechas**: Todas las fechas están en formato ISO 8601 con zona horaria UTC (Z).

3. **Precios**: Los precios están en soles peruanos (S/).

4. **Estados**: Algunos registros están marcados como inactivos para probar filtros y validaciones.

5. **Documentos**: Los DNIs y licencias son ficticios pero siguen el formato peruano estándar.
