# Modèles TypeScript - Architecture Organisée

Ce document décrit l'organisation professionnelle des interfaces et types TypeScript utilisés dans l'application.

## 📁 Structure des Modèles

```
src/app/models/
├── index.ts              # Export principal de tous les modèles
├── common/
│   └── types.ts          # Types et enums communs
├── auth/
│   └── user.ts           # Interfaces d'authentification
├── inventory/
│   └── index.ts          # Interfaces de gestion d'inventaire
├── demandes/
│   └── demande.ts        # Interfaces des demandes
└── api/
    └── responses.ts      # Interfaces API et réponses
```

## 🎯 Principes d'Organisation

### 1. Séparation par Domaine
- **common/** : Types partagés (enums, interfaces de base)
- **auth/** : Tout ce qui concerne l'authentification
- **inventory/** : Gestion des articles, camions, sites
- **demandes/** : Gestion des demandes de transport
- **api/** : Réponses et erreurs API

### 2. Types et Enums
- Utilisation d'unions de chaînes pour les enums
- Types spécifiques pour les statuts et rôles
- Interfaces de base réutilisables

### 3. Compatibilité API
- Support des noms alternatifs (snake_case/camelCase)
- Interfaces flexibles pour l'évolution des APIs
- Types optionnels pour les champs variables

## 📋 Interfaces Principales

### Types Communs (`common/types.ts`)
```typescript
export type UserRole = 'ADMIN' | 'DEMANDEUR' | 'VALIDATEUR';
export type TransactionType = 'SORTIE' | 'ENTREE';
export type DemandeStatus = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### Utilisateur (`auth/user.ts`)
```typescript
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
```

### Demande (`demandes/demande.ts`)
```typescript
export interface Demande extends BaseEntity, TimestampedEntity {
  libelle: string;
  capacite: number;
  typeTransaction: TransactionType;
  statut: DemandeStatus;
  // ... relations et champs
}

export interface DemandePayload {
  libelle: string;
  capacite: number;
  typeTransaction: TransactionType;
  lignes: DemandeLigne[];
}
```

## 🔧 Bonnes Pratiques

### 1. Typing Strict
- Pas d'utilisation de `any` dans les services
- Interfaces spécifiques pour chaque payload
- Types génériques pour les réponses API

### 2. Compatibilité
- Support des variations de nommage API
- Champs optionnels pour l'évolution
- Types unions pour les enums

### 3. Réutilisabilité
- Interfaces de base (`BaseEntity`, `TimestampedEntity`)
- Types communs partagés
- Exports centralisés via `index.ts`

## 🚀 Avantages

- **Sécurité de type** : Détection d'erreurs à la compilation
- **Maintenance** : Interfaces centralisées et organisées
- **Évolutivité** : Facile d'ajouter de nouveaux champs/types
- **Documentation** : Auto-documentation via TypeScript
- **IntelliSense** : Meilleure expérience développeur

## 📝 Migration

Les anciens fichiers ont été supprimés et remplacés par cette nouvelle structure :
- ✅ `article.ts` → `inventory/index.ts`
- ✅ `camion.ts` → `inventory/index.ts`
- ✅ `type-camion.ts` → `inventory/index.ts`
- ✅ `user.model.ts` → `auth/user.ts`

Tous les services et composants ont été mis à jour pour utiliser les nouvelles interfaces.
