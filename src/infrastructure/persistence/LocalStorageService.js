/**
 * Servicio de persistencia usando LocalStorage
 */
export class LocalStorageService {
  constructor(key) {
    this.key = key;
  }

  /**
   * Obtiene todos los items del storage
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer del localStorage:', error);
      return [];
    }
  }

  /**
   * Obtiene un item por ID
   */
  getById(id) {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  /**
   * Guarda un nuevo item
   */
  save(item) {
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
    return item;
  }

  /**
   * Actualiza un item existente
   */
  update(item) {
    const items = this.getAll();
    const index = items.findIndex(i => i.id === item.id);

    if (index === -1) {
      throw new Error('Item no encontrado');
    }

    items[index] = item;
    this.saveAll(items);
    return item;
  }

  /**
   * Elimina un item por ID
   */
  delete(id) {
    const items = this.getAll();
    const filteredItems = items.filter(item => item.id !== id);

    if (items.length === filteredItems.length) {
      throw new Error('Item no encontrado');
    }

    this.saveAll(filteredItems);
    return true;
  }

  /**
   * Guarda todos los items
   */
  saveAll(items) {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      throw new Error('Error al persistir los datos');
    }
  }

  /**
   * Limpia todos los datos
   */
  clear() {
    localStorage.removeItem(this.key);
  }
}
