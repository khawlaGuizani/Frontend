import { BaseEntity, TimestampedEntity, TransactionType, DemandeStatus, LigneType } from '../common/types';
import { User } from '../auth/user';
import { Article, Camion, Fournisseur, Site } from '../inventory';

// Interfaces pour la gestion des demandes

export interface DemandeLigne {
  id?: number;
  articleId: number | null;
  article?: Article;
  quantite: number;
  type: LigneType;
  unite?: string;
  commentaires?: string;
}

export interface Demande extends BaseEntity, TimestampedEntity {
  libelle: string;
  capacite: number;
  typeTransaction: TransactionType;
  type_transaction?: TransactionType; // alias pour compatibilité API

  // Relations
  siteDepartId?: number | null;
  siteDepart?: Site;
  site_depart_id?: number | null; // alias pour compatibilité API

  siteArriveeId?: number | null;
  siteArrivee?: Site;
  site_arrivee_id?: number | null; // alias pour compatibilité API

  camionId?: number | null;
  camion?: Camion;
  camion_id?: number | null; // alias pour compatibilité API

  fournisseurId?: number | null;
  fournisseur?: Fournisseur;
  fournisseur_id?: number | null; // alias pour compatibilité API

  demandeurId?: number | null;
  demandeur?: User;
  demandeur_id?: number | null; // alias pour compatibilité API

  // Statut et validation
  statut: DemandeStatus;
  status?: DemandeStatus; // alias pour compatibilité API

  motifRejet?: string;
  motif_rejet?: string;
  raisonRejet?: string;
  raison_rejet?: string;
  motifRefus?: string;
  motif_refus?: string;

  // Lignes d'articles
  lignes?: DemandeLigne[];
}

export interface DemandePayload {
  libelle: string;
  capacite: number;
  typeTransaction: TransactionType;
  siteDepartId?: number | null;
  siteArriveeId?: number | null;
  camionId?: number | null;
  fournisseurId?: number | null;
  lignes: Omit<DemandeLigne, 'id' | 'article'>[];
}

export interface ValidationPayload {
  motif?: string;
}

export interface DemandeFilters {
  statut?: DemandeStatus;
  demandeurId?: number;
  siteDepartId?: number;
  siteArriveeId?: number;
  dateDebut?: string;
  dateFin?: string;
}

export interface DemandeStats {
  total: number;
  enAttente: number;
  validees: number;
  rejetees: number;
}