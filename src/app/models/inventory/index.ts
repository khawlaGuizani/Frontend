import { BaseEntity } from '../common/types';

// Interfaces pour la gestion de l'inventaire

export interface Article extends BaseEntity {
  codeArticle: string;
  code_article?: string;
  libelle?: string;
  unit: string;
  unite?: string;
  quantite: number;
  stock?: number;
  description?: string;
}

export interface ArticlePayload {
  codeArticle: string;
  libelle?: string;
  unit: string;
  quantite: number;
  description?: string;
}

export interface Camion extends BaseEntity {
  immatriculation: string;
  matricule?: string; // alias pour compatibilité
  capacite: number;
  typeCamionId?: number;
  typeCamion?: TypeCamion;
  description?: string;
}

export interface CamionPayload {
  immatriculation: string;
  capacite: number;
  typeCamionId?: number;
  description?: string;
}

export interface TypeCamion extends BaseEntity {
  libelle: string;
  capaciteMax: number;
  description?: string;
}

export interface TypeCamionPayload {
  libelle: string;
  capaciteMax: number;
  description?: string;
}

export interface Fournisseur extends BaseEntity {
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  codeFournisseur?: string;
}

export interface FournisseurPayload {
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  codeFournisseur?: string;
}

export interface Site extends BaseEntity {
  libelle: string;
  codeSite?: string;
  code_site?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  type?: 'DEPOT' | 'MAGASIN' | 'CHANTIER';
}

export interface SitePayload {
  libelle: string;
  codeSite?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  type?: 'DEPOT' | 'MAGASIN' | 'CHANTIER';
}