import { UserRole, BaseEntity } from '../common/types';

// Interfaces pour l'authentification et gestion des utilisateurs

export interface User extends BaseEntity {
  nom: string;
  email: string;
  role: UserRole;
}

export interface UserPayload {
  nom: string;
  email: string;
  motDePasse: string;
  role: UserRole;
}

export interface UserUpdatePayload {
  nom?: string;
  email?: string;
  role?: UserRole;
}

export interface PasswordPayload {
  motDePasse: string;
}

export interface LoginPayload {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordChangePayload {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}