import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FournisseurService } from '../../../services/fournisseur.service';
import { FournisseurFormComponent } from './fournisseur-form.component';
import { FournisseurListComponent } from './fournisseur-list.component';

@Component({
  selector: 'app-fournisseur-management',
  standalone: true,
  imports: [CommonModule, FournisseurFormComponent, FournisseurListComponent],
  template: `
    <div class="alert success" *ngIf="message">{{ message }}</div>
    <div class="alert error" *ngIf="errorMessage">{{ errorMessage }}</div>
    <section class="workspace">
      <div class="section-title">
        <div><p class="eyebrow">Partenaires</p><h2>Fournisseurs</h2></div>
        <span class="count-pill">{{ fournisseurs.length }} fournisseurs</span>
      </div>
      <app-fournisseur-form [fournisseur]="fournisseur" [selectedFournisseur]="selectedFournisseur" [isSubmitting]="isSubmitting" (save)="selectedFournisseur ? saveFournisseur() : addFournisseur()" (cancel)="cancelFournisseurEdit()"></app-fournisseur-form>
      <app-fournisseur-list [fournisseurs]="fournisseurs" (edit)="editFournisseur($event)" (remove)="deleteFournisseur($event)"></app-fournisseur-list>
    </section>
  `
})
export class FournisseurManagementComponent implements OnInit {
  fournisseurs: any[] = [];
  fournisseur = this.createEmptyFournisseur();
  selectedFournisseur: any | null = null;
  isSubmitting = false;
  message = '';
  errorMessage = '';

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.fournisseurService.getAll().subscribe({ next: (data) => (this.fournisseurs = data) });
  }

  addFournisseur(): void {
    this.submit(() => this.fournisseurService.create(this.fournisseur), () => {
      this.message = 'Fournisseur ajoute avec succes.';
      this.fournisseur = this.createEmptyFournisseur();
      this.loadFournisseurs();
    });
  }

  editFournisseur(fournisseur: any): void {
    this.selectedFournisseur = fournisseur;
    this.fournisseur = { nom: fournisseur.nom || '', contact: fournisseur.contact || '', email: fournisseur.email || '', actif: fournisseur.actif ?? true };
  }

  saveFournisseur(): void {
    if (!this.selectedFournisseur) return;
    this.submit(() => this.fournisseurService.update(this.selectedFournisseur.id, this.fournisseur), () => {
      this.message = 'Fournisseur modifie avec succes.';
      this.cancelFournisseurEdit();
      this.loadFournisseurs();
    });
  }

  deleteFournisseur(id: number): void {
    this.deleteResource('Supprimer ce fournisseur ?', () => this.fournisseurService.delete(id), () => {
      this.message = 'Fournisseur supprime avec succes.';
      this.loadFournisseurs();
    });
  }

  cancelFournisseurEdit(): void {
    this.selectedFournisseur = null;
    this.fournisseur = this.createEmptyFournisseur();
  }

  private submit(requestFactory: () => any, onSuccess: () => void): void {
    this.isSubmitting = true;
    this.clearAlerts();
    requestFactory().subscribe({ next: () => { onSuccess(); this.isSubmitting = false; }, error: () => { this.errorMessage = 'Operation impossible. Verifie les donnees et les droits admin.'; this.isSubmitting = false; } });
  }

  private deleteResource(message: string, requestFactory: () => any, onSuccess: () => void): void {
    if (!confirm(message)) return;
    this.clearAlerts();
    requestFactory().subscribe({ next: onSuccess, error: () => (this.errorMessage = 'Suppression impossible.') });
  }

  private clearAlerts(): void {
    this.message = '';
    this.errorMessage = '';
  }

  private createEmptyFournisseur() {
    return { nom: '', contact: '', email: '', actif: true };
  }
}
