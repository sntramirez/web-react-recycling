/**
 * Servicio de permisos por rol
 * Define qué acciones puede realizar cada rol
 */
export class PermissionsService {
  static ROLES = {
    ADMIN: 'admin',
    USUARIO: 'usuario',
    CAJERO: 'cajero'
  };

  static PERMISSIONS = {
    // Dashboard
    VIEW_DASHBOARD: 'view_dashboard',

    // Materiales
    VIEW_MATERIALES: 'view_materiales',
    CREATE_MATERIAL: 'create_material',
    EDIT_MATERIAL: 'edit_material',
    DELETE_MATERIAL: 'delete_material',
    CHANGE_PRICE: 'change_price',

    // Recibos
    VIEW_RECIBOS: 'view_recibos',
    CREATE_RECIBO: 'create_recibo',
    DELETE_RECIBO: 'delete_recibo',

    // Personas/Vendedores
    VIEW_PERSONAS: 'view_personas',
    CREATE_PERSONA: 'create_persona',
    EDIT_PERSONA: 'edit_persona',
    DELETE_PERSONA: 'delete_persona',
  };

  static ROLE_PERMISSIONS = {
    [this.ROLES.ADMIN]: [
      // Dashboard
      this.PERMISSIONS.VIEW_DASHBOARD,

      // Materiales - Admin puede TODO con materiales
      this.PERMISSIONS.VIEW_MATERIALES,
      this.PERMISSIONS.CREATE_MATERIAL,
      this.PERMISSIONS.EDIT_MATERIAL,
      this.PERMISSIONS.DELETE_MATERIAL,
      this.PERMISSIONS.CHANGE_PRICE,

      // Recibos - Admin puede ver todos
      this.PERMISSIONS.VIEW_RECIBOS,
      this.PERMISSIONS.CREATE_RECIBO,
      this.PERMISSIONS.DELETE_RECIBO,

      // Personas - Admin puede ver
      this.PERMISSIONS.VIEW_PERSONAS,
      this.PERMISSIONS.CREATE_PERSONA,
      this.PERMISSIONS.EDIT_PERSONA,
      this.PERMISSIONS.DELETE_PERSONA,
    ],

    [this.ROLES.USUARIO]: [
      // Dashboard
      this.PERMISSIONS.VIEW_DASHBOARD,

      // Materiales - Solo ver
      this.PERMISSIONS.VIEW_MATERIALES,

      // Recibos - Solo ver
      this.PERMISSIONS.VIEW_RECIBOS,

      // Personas - Usuario puede gestionar personas/vendedores
      this.PERMISSIONS.VIEW_PERSONAS,
      this.PERMISSIONS.CREATE_PERSONA,
      this.PERMISSIONS.EDIT_PERSONA,
      this.PERMISSIONS.DELETE_PERSONA,
    ],

    [this.ROLES.CAJERO]: [
      // Materiales - Solo ver precios
      this.PERMISSIONS.VIEW_MATERIALES,

      // Recibos - Cajero puede emitir recibos
      this.PERMISSIONS.VIEW_RECIBOS,
      this.PERMISSIONS.CREATE_RECIBO,

      // Personas - Solo ver para seleccionar vendedor
      this.PERMISSIONS.VIEW_PERSONAS,
    ],
  };

  /**
   * Verifica si un rol tiene un permiso específico
   */
  static hasPermission(userRole, permission) {
    if (!userRole) return false;
    const rolePermissions = this.ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   */
  static userHasPermission(user, permission) {
    if (!user || !user.rol) return false;
    return this.hasPermission(user.rol, permission);
  }

  /**
   * Obtiene todos los permisos de un rol
   */
  static getRolePermissions(role) {
    return this.ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Verifica si un usuario puede acceder a una sección
   */
  static canAccessSection(user, section) {
    if (!user) return false;

    const sectionPermissions = {
      dashboard: this.PERMISSIONS.VIEW_DASHBOARD,
      materiales: this.PERMISSIONS.VIEW_MATERIALES,
      recibos: this.PERMISSIONS.VIEW_RECIBOS,
      personas: this.PERMISSIONS.VIEW_PERSONAS,
    };

    const requiredPermission = sectionPermissions[section];
    return requiredPermission ? this.userHasPermission(user, requiredPermission) : false;
  }
}
