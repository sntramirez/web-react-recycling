import { createContext, useContext } from 'react';
import { LocalStorageMaterialRepository } from '../../infrastructure/repositories/LocalStorageMaterialRepository';
import { LocalStorageReciboRepository } from '../../infrastructure/repositories/LocalStorageReciboRepository';
import { LocalStoragePersonaRepository } from '../../infrastructure/repositories/LocalStoragePersonaRepository';
import { CreateMaterial } from '../../application/use-cases/material/CreateMaterial';
import { GetAllMaterials } from '../../application/use-cases/material/GetAllMaterials';
import { UpdateMaterial } from '../../application/use-cases/material/UpdateMaterial';
import { DeleteMaterial } from '../../application/use-cases/material/DeleteMaterial';
import { CreateRecibo } from '../../application/use-cases/recibo/CreateRecibo';
import { GetAllRecibos } from '../../application/use-cases/recibo/GetAllRecibos';
import { GetReciboById } from '../../application/use-cases/recibo/GetReciboById';
import { CreatePersona } from '../../application/use-cases/persona/CreatePersona';
import { GetAllPersonas } from '../../application/use-cases/persona/GetAllPersonas';
import { UpdatePersona } from '../../application/use-cases/persona/UpdatePersona';
import { DeletePersona } from '../../application/use-cases/persona/DeletePersona';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Inicializar repositorios
  const materialRepository = new LocalStorageMaterialRepository();
  const reciboRepository = new LocalStorageReciboRepository();
  const personaRepository = new LocalStoragePersonaRepository();

  // Inicializar casos de uso de Material
  const createMaterial = new CreateMaterial(materialRepository);
  const getAllMaterials = new GetAllMaterials(materialRepository);
  const updateMaterial = new UpdateMaterial(materialRepository);
  const deleteMaterial = new DeleteMaterial(materialRepository);

  // Inicializar casos de uso de Recibo
  const createRecibo = new CreateRecibo(reciboRepository, materialRepository);
  const getAllRecibos = new GetAllRecibos(reciboRepository);
  const getReciboById = new GetReciboById(reciboRepository);

  // Inicializar casos de uso de Persona
  const createPersona = new CreatePersona(personaRepository);
  const getAllPersonas = new GetAllPersonas(personaRepository);
  const updatePersona = new UpdatePersona(personaRepository);
  const deletePersona = new DeletePersona(personaRepository);

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
    // Casos de uso de Persona
    createPersona,
    getAllPersonas,
    updatePersona,
    deletePersona,
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
