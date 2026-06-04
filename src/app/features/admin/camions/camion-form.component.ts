import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-camion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel resource-panel">
      <div class="form-grid compact">
        <label><span>Immatriculation</span><input [(ngModel)]="camion.immatriculation" name="immatriculation" placeholder="Immatriculation" /></label>
        <label><span>Capacite</span><input [(ngModel)]="camion.capaciteReelle" name="capacite" type="number" placeholder="Capacite" /></label>
        <label><span>Annee</span><input [(ngModel)]="camion.annee" name="annee" type="number" placeholder="Annee" /></label>
        <label>
          <span>Type camion</span>
          <select [(ngModel)]="camion.typeCamionId" name="typeCamionId">
            <option [ngValue]="null">Choisir type</option>
            <option *ngFor="let t of typesCamion" [ngValue]="t.id">{{ t.libelle }}</option>
          </select>
        </label>
        <label class="inline-check"><input type="checkbox" [(ngModel)]="camion.disponible" name="disponible" />Disponible</label>
      </div>
      <div class="action-row">
        <button class="primary-button" type="button" (click)="save.emit()" [disabled]="isSubmitting">{{ selectedCamion ? 'Enregistrer camion' : 'Ajouter camion' }}</button>
        <button class="ghost-button" type="button" *ngIf="selectedCamion" (click)="cancel.emit()">Annuler</button>
      </div>
    </section>
  `
})
export class CamionFormComponent {
  @Input({ required: true }) camion: any;
  @Input() typesCamion: any[] = [];
  @Input() selectedCamion: any | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
