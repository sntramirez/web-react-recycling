import { createContext, useContext } from 'react';
import { LocalStorageMaterialRepository } from '../../infrastructure/repositories/LocalStorageMaterialRepository';
import { LocalStorageReciboRepository } from '../../infrastructure/repositories/LocalStorageReciboRepository';
import { CreateMaterial } from '../../application/use-cases/material/CreateMaterial';
import { GetAllMaterials } from '../../application/use-cases/material/GetAllMaterials';
import { UpdateMaterial } from '../../application/use-cases/material/UpdateMaterial';
import { DeleteMaterial } from '../../application/use-cases/material/DeleteMaterial';
import { CreateRecibo } from '../../application/use-cases/recibo/CreateRecibo';
import { GetAllRecibos } from '../../application/use-cases/recibo/GetAllRecibos';
import { GetReciboById } from '../../application/use-cases/recibo/GetReciboById';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Inicializar repositorios
  const materialRepository = new LocalStorageMaterialRepository();
  const reciboRepository = new LocalStorageReciboRepository();

  // Inicializar casos de uso de Material
  const createMaterial = new CreateMaterial(materialRepository);
  const getAllMaterials = new GetAllMaterials(materialRepository);
  const updateMaterial = new UpdateMaterial(materialRepository);
  const deleteMaterial = new DeleteMaterial(materialRepository);

  // Inicializar casos de uso de Recibo
  const createRecibo = new CreateRecibo(reciboRepository, materialRepository);
  const getAllRecibos = new GetAllRecibos(reciboRepository);
  const getReciboById = new GetReciboById(reciboRepository);

  const value = {
    // Casos de uso de Material
    createMaterial,
    getAllMaterials,
    updateMaterial,
    deleteMaterial,
    // Casos de uso de Recibo
    createRecibo,
    getAllRecibos,
    getReciboById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};
