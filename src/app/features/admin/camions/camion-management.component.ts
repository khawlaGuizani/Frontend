import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CamionService } from '../../../services/camion.service';
import { TypeCamionService } from '../../../services/type-camion.service';
import { CamionFormComponent } from './camion-form.component';
import { CamionListComponent } from './camion-list.component';

@Component({
  selector: 'app-camion-management',
  standalone: true,
  imports: [CommonModule, CamionFormComponent, CamionListComponent],
  template: `
    <div class="alert success" *ngIf="message">{{ message }}</div>
    <div class="alert error" *ngIf="errorMessage">{{ errorMessage }}</div>
    <section class="workspace">
      <div class="section-title">
        <div><p class="eyebrow">Flotte</p><h2>Gestion des camions</h2></div>
        <button class="secondary-button" type="button" (click)="loadCamions()">Actualiser</button>
      </div>
      <app-camion-form [camion]="camion" [typesCamion]="typesCamion" [selectedCamion]="selectedCamion" [isSubmitting]="isSubmitting" (save)="selectedCamion ? saveCamion() : addCamion()" (cancel)="cancelCamionEdit()"></app-camion-form>
      <app-camion-list [camions]="camions" (edit)="editCamion($event)" (remove)="deleteCamion($event)"></app-camion-list>
    </section>
  `
})
export class CamionManagementComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();
  camions: any[] = [];
  typesCamion: any[] = [];
  camion = this.createEmptyCamion();
  selectedCamion: any | null = null;
  isSubmitting = false;
  message = '';
  errorMessage = '';

  constructor(private camionService: CamionService, private typeCamionService: TypeCamionService) {}

  ngOnInit(): void {
    this.loadCamions();
    this.typeCamionService.getAll().subscribe({ next: (data) => (this.typesCamion = data) });
  }

  loadCamions(): void {
    this.camionService.getAll().subscribe({ next: (data) => (this.camions = data) });
  }

  addCamion(): void {
    this.submit(() => this.camionService.create(this.camion), () => {
      this.message = 'Camion ajoute avec succes.';
      this.camion = this.createEmptyCamion();
      this.reload();
    });
  }

  editCamion(camion: any): void {
    this.selectedCamion = camion;
    this.camion = {
      immatriculation: camion.immatriculation || '',
      capaciteReelle: camion.capaciteReelle ?? camion.capacite_reelle ?? camion.capacite ?? 0,
      annee: camion.annee ?? 2024,
      disponible: camion.disponible ?? true,
      typeCamionId: camion.typeCamionId ?? camion.type_camion_id ?? camion.typeCamion?.id ?? null
    };
  }

  saveCamion(): void {
    if (!this.selectedCamion) return;
    this.submit(() => this.camionService.update(this.selectedCamion.id, this.camion), () => {
      this.message = 'Camion modifie avec succes.';
      this.cancelCamionEdit();
      this.reload();
    });
  }

  deleteCamion(id: number): void {
    this.deleteResource('Supprimer ce camion ?', () => this.camionService.delete(id), () => {
      this.message = 'Camion supprime avec succes.';
      this.reload();
    });
  }

  cancelCamionEdit(): void {
    this.selectedCamion = null;
    this.camion = this.createEmptyCamion();
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

  private reload(): void {
    this.loadCamions();
    this.changed.emit();
  }

  private clearAlerts(): void {
    this.message = '';
    this.errorMessage = '';
  }

  private createEmptyCamion() {
    return { immatriculation: '', capaciteReelle: 0, annee: 2024, disponible: true, typeCamionId: null as number | null };
  }
}
