import { createContext, useContext, useEffect } from 'react';
import { LocalStorageMaterialRepository } from '../../infrastructure/repositories/LocalStorageMaterialRepository';
import { LocalStorageReciboRepository } from '../../infrastructure/repositories/LocalStorageReciboRepository';
import { LocalStoragePersonaRepository } from '../../infrastructure/repositories/LocalStoragePersonaRepository';
import { LocalStorageTransportistaRepository } from '../../infrastructure/repositories/LocalStorageTransportistaRepository';
import { LocalStorageGuiaRemisionRepository } from '../../infrastructure/repositories/LocalStorageGuiaRemisionRepository';
import { DataInitializationService } from '../../infrastructure/services/DataInitializationService';
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
import { CreateTransportista } from '../../application/use-cases/transportista/CreateTransportista';
import { GetAllTransportistas } from '../../application/use-cases/transportista/GetAllTransportistas';
import { UpdateTransportista } from '../../application/use-cases/transportista/UpdateTransportista';
import { DeleteTransportista } from '../../application/use-cases/transportista/DeleteTransportista';
import { CreateGuiaRemision } from '../../application/use-cases/guia-remision/CreateGuiaRemision';
import { GetAllGuiasRemision } from '../../application/use-cases/guia-remision/GetAllGuiasRemision';
import { GetGuiaRemisionById } from '../../application/use-cases/guia-remision/GetGuiaRemisionById';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Inicializar datos mock al montar el componente
  useEffect(() => {
    DataInitializationService.initializeAllData().catch(error => {
      console.error('Error al inicializar datos:', error);
    });
  }, []);

  // Inicializar repositorios
  const materialRepository = new LocalStorageMaterialRepository();
  const reciboRepository = new LocalStorageReciboRepository();
  const personaRepository = new LocalStoragePersonaRepository();
  const transportistaRepository = new LocalStorageTransportistaRepository();
  const guiaRemisionRepository = new LocalStorageGuiaRemisionRepository();

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

  // Inicializar casos de uso de Transportista
  const createTransportista = new CreateTransportista(transportistaRepository);
  const getAllTransportistas = new GetAllTransportistas(transportistaRepository);
  const updateTransportista = new UpdateTransportista(transportistaRepository);
  const deleteTransportista = new DeleteTransportista(transportistaRepository);

  // Inicializar casos de uso de Guía de Remisión
  const createGuiaRemision = new CreateGuiaRemision(guiaRemisionRepository, reciboRepository, transportistaRepository);
  const getAllGuiasRemision = new GetAllGuiasRemision(guiaRemisionRepository);
  const getGuiaRemisionById = new GetGuiaRemisionById(guiaRemisionRepository);

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
    // Casos de uso de Transportista
    createTransportista,
    getAllTransportistas,
    updateTransportista,
    deleteTransportista,
    // Casos de uso de Guía de Remisión
    createGuiaRemision,
    getAllGuiasRemision,
    getGuiaRemisionById,
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
