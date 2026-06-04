import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-type-camion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel resource-panel">
      <div class="form-grid compact">
        <label><span>Libelle</span><input [(ngModel)]="typeCamion.libelle" name="libelle" placeholder="Libelle" /></label>
        <label><span>Capacite max</span><input [(ngModel)]="typeCamion.capaciteMax" name="capaciteMax" type="number" placeholder="Capacite max" /></label>
        <label><span>Description</span><input [(ngModel)]="typeCamion.description" name="description" placeholder="Description" /></label>
      </div>
      <div class="action-row">
        <button class="primary-button" type="button" (click)="save.emit()" [disabled]="isSubmitting">{{ selectedTypeCamion ? 'Enregistrer type' : 'Ajouter type' }}</button>
        <button class="ghost-button" type="button" *ngIf="selectedTypeCamion" (click)="cancel.emit()">Annuler</button>
      </div>
    </section>
  `
})
export class TypeCamionFormComponent {
  @Input({ required: true }) typeCamion: any;
  @Input() selectedTypeCamion: any | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
