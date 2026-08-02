import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TypeCamionService } from '../../../services/type-camion.service';
import { TypeCamionFormComponent } from './type-camion-form.component';
import { TypeCamionListComponent } from './type-camion-list.component';

@Component({
  selector: 'app-type-camion-management',
  standalone: true,
  imports: [CommonModule, TypeCamionFormComponent, TypeCamionListComponent],
  template: `
    <div class="alert success" *ngIf="message">{{ message }}</div>
    <div class="alert error" *ngIf="errorMessage">{{ errorMessage }}</div>
    <section class="workspace">
      <div class="section-title">
        <div><p class="eyebrow">Configuration</p><h2>Types camion</h2></div>
        <button class="secondary-button" type="button" (click)="loadTypesCamion()">Actualiser</button>
      </div>
      <app-type-camion-form [typeCamion]="typeCamion" [selectedTypeCamion]="selectedTypeCamion" [isSubmitting]="isSubmitting" (save)="selectedTypeCamion ? saveTypeCamion() : addTypeCamion()" (cancel)="cancelTypeCamionEdit()"></app-type-camion-form>
      <app-type-camion-list [typesCamion]="typesCamion" (edit)="editTypeCamion($event)" (remove)="deleteTypeCamion($event)"></app-type-camion-list>
    </section>
  `
})
export class TypeCamionManagementComponent implements OnInit {
  typesCamion: any[] = [];
  typeCamion = this.createEmptyTypeCamion();
  selectedTypeCamion: any | null = null;
  isSubmitting = false;
  message = '';
  errorMessage = '';

  constructor(private typeCamionService: TypeCamionService) {}

  ngOnInit(): void {
    this.loadTypesCamion();
  }

  loadTypesCamion(): void {
    this.typeCamionService.getAll().subscribe({ next: (data) => (this.typesCamion = data) });
  }

  addTypeCamion(): void {
    this.submit(() => this.typeCamionService.create(this.typeCamion), () => {
      this.message = 'Type camion ajoute avec succes.';
      this.typeCamion = this.createEmptyTypeCamion();
      this.loadTypesCamion();
    });
  }

  editTypeCamion(typeCamion: any): void {
    this.selectedTypeCamion = typeCamion;
    this.typeCamion = {
      libelle: typeCamion.libelle || '',
      capaciteMax: typeCamion.capaciteMax ?? typeCamion.capacite_max ?? 0,
      description: typeCamion.description || ''
    };
  }

  saveTypeCamion(): void {
    if (!this.selectedTypeCamion) return;
    this.submit(() => this.typeCamionService.update(this.selectedTypeCamion.id, this.typeCamion), () => {
      this.message = 'Type camion modifie avec succes.';
      this.cancelTypeCamionEdit();
      this.loadTypesCamion();
    });
  }

  deleteTypeCamion(id: number): void {
    this.deleteResource('Supprimer ce type camion ?', () => this.typeCamionService.delete(id), () => {
      this.message = 'Type camion supprime avec succes.';
      this.loadTypesCamion();
    });
  }

  cancelTypeCamionEdit(): void {
    this.selectedTypeCamion = null;
    this.typeCamion = this.createEmptyTypeCamion();
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

  private createEmptyTypeCamion() {
    return { libelle: '', capaciteMax: 0, description: '' };
  }
}
