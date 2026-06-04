// Types et enums communs utilisés dans toute l'application

export type UserRole = 'ADMIN' | 'DEMANDEUR' | 'VALIDATEUR';

export type TransactionType = 'SORTIE' | 'ENTREE';

export type DemandeStatus = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

export type LigneType = 'SORTIE' | 'ENTREE';

// Interface de base pour les entités avec ID
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// Interface pour les entités avec timestamps multiples (compatibilité API)
export interface TimestampedEntity {
  dateCreation?: string;
  date_creation?: string;
  dateValidation?: string;
  date_validation?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}