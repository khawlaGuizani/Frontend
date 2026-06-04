import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-site-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel resource-panel">
      <div class="form-grid compact">
        <label><span>Code site</span><input [(ngModel)]="site.codeSite" name="codeSite" placeholder="Code site" /></label>
        <label><span>Libelle</span><input [(ngModel)]="site.libelle" name="libelle" placeholder="Libelle" /></label>
        <label><span>Adresse</span><input [(ngModel)]="site.adresse" name="adresse" placeholder="Adresse" /></label>
        <label><span>Ville</span><input [(ngModel)]="site.ville" name="ville" placeholder="Ville" /></label>
        <label class="inline-check"><input type="checkbox" [(ngModel)]="site.actif" name="actif" />Actif</label>
      </div>
      <div class="action-row">
        <button class="primary-button" type="button" (click)="save.emit()" [disabled]="isSubmitting">{{ selectedSite ? 'Enregistrer site' : 'Ajouter site' }}</button>
        <button class="ghost-button" type="button" *ngIf="selectedSite" (click)="cancel.emit()">Annuler</button>
      </div>
    </section>
  `
})
export class SiteFormComponent {
  @Input({ required: true }) site: any;
  @Input() selectedSite: any | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
