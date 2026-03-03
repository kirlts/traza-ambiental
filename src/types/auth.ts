export interface Role {
  id: string;
  name: string;
  description: string | null;
}

export interface UserRolesResponse {
  success: boolean;
  data: {
    roles: Role[];
  };
  error?: string;
  message?: string;
}

export interface Vehiculo {
  id: string;
  patente: string;
  tipo: string;
  capacidadKg: number;
  estado: string;
}

export interface VehiculosResponse {
  success: boolean;
  vehiculos: Vehiculo[];
}

export interface CapacidadVehiculoResponse {
  capacidadDisponible: number;
}
