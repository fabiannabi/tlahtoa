import type { RoleId, ResourceKind } from '../types.js';

export interface RoleDefinition {
  id: RoleId;
  nombre: string;
  especialidad: string;
  resource: ResourceKind;
  optionalIn4Players: boolean;
}

export const ROLES: Record<RoleId, RoleDefinition> = {
  sacerdote: {
    id: 'sacerdote',
    nombre: 'Teopixqui — el Sacerdote',
    especialidad: 'Copal y eventos rituales',
    resource: 'copal',
    optionalIn4Players: false,
  },
  general: {
    id: 'general',
    nombre: 'Cuāuhpilli — el General',
    especialidad: 'Amenazas militares y Fuerza de trabajo',
    resource: 'ft',
    optionalIn4Players: false,
  },
  comerciante: {
    id: 'comerciante',
    nombre: 'Pochtecatl — el Comerciante',
    especialidad: 'Jade y rutas comerciales',
    resource: 'jade',
    optionalIn4Players: true,
  },
  curandera: {
    id: 'curandera',
    nombre: 'Ticitl — la Curandera',
    especialidad: 'Fuerza de trabajo y epidemia',
    resource: 'ft',
    optionalIn4Players: false,
  },
  astronomo: {
    id: 'astronomo',
    nombre: 'Tonalpouhqui — el Astrónomo',
    especialidad: 'Conocimiento y predicción de eventos',
    resource: 'conocimiento',
    optionalIn4Players: false,
  },
};

export const ALL_ROLE_IDS: RoleId[] = [
  'sacerdote',
  'general',
  'comerciante',
  'curandera',
  'astronomo',
];
