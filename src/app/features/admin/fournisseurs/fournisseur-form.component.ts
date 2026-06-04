import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fournisseur-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel resource-panel">
      <div class="form-grid compact">
        <label><span>Nom</span><input [(ngModel)]="fournisseur.nom" name="nom" placeholder="Nom" /></label>
        <label><span>Contact</span><input [(ngModel)]="fournisseur.contact" name="contact" placeholder="Contact" /></label>
        <label><span>Email</span><input [(ngModel)]="fournisseur.email" name="email" placeholder="Email" /></label>
        <label class="inline-check"><input type="checkbox" [(ngModel)]="fournisseur.actif" name="actif" />Actif</label>
      </div>
      <div class="action-row">
        <button class="primary-button" type="button" (click)="save.emit()" [disabled]="isSubmitting">{{ selectedFournisseur ? 'Enregistrer fournisseur' : 'Ajouter fournisseur' }}</button>
        <button class="ghost-button" type="button" *ngIf="selectedFournisseur" (click)="cancel.emit()">Annuler</button>
      </div>
    </section>
  `
})
export class FournisseurFormComponent {
  @Input({ required: true }) fournisseur: any;
  @Input() selectedFournisseur: any | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
