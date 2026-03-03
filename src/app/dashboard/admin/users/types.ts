export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string | null;
  rut: string | null;
  email: string;
  emailVerified?: string | null;
  image: string | null;
  active: boolean;
  cuentaAprobada: boolean;
  tipoEmpresa: string | null;
  capacidadProcesamiento: number | null;
  tipoPlanta: string | null;
  idRETC?: string | null;
  direccionComercial?: string | null;
  direccionCasaMatriz?: string | null;
  tipoProductorREP?: string | null;
  tiposResiduos?: string[];
  createdAt: string;
  roles: Role[];
}

export interface UserFormData {
  name: string;
  rut: string;
  email: string;
  password: string;
  image: string;
  active: boolean;
  cuentaAprobada: boolean;
  tipoEmpresa: string;
  capacidadProcesamiento: string;
  tipoPlanta: string;
  idRETC: string;
  direccionComercial: string;
  direccionCasaMatriz: string;
  tipoProductorREP: string;
  tiposResiduos: string[];
  roleIds: string[];
}
