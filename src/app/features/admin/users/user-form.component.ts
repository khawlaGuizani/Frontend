import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel">
      <div class="panel-head">
        <h3>{{ selectedUser ? "Modifier l'utilisateur" : 'Ajouter un utilisateur' }}</h3>
        <p *ngIf="selectedUser">Compte selectionne : #{{ selectedUser.id }} - {{ selectedUser.nom }}</p>
        <p *ngIf="!selectedUser">Complete le formulaire puis enregistre le nouveau compte.</p>
      </div>

      <div class="form-grid">
        <label><span>Nom</span><input [(ngModel)]="form.nom" /></label>
        <label><span>Email</span><input [(ngModel)]="form.email" placeholder="Ex: admin@transport.tn" /></label>
        <label *ngIf="!selectedUser"><span>Mot de passe</span><input [(ngModel)]="form.motDePasse" type="password" /></label>
        <label>
          <span>Role</span>
          <select [(ngModel)]="form.role">
            <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
          </select>
        </label>
        <label *ngIf="selectedUser"><span>Nouveau mot de passe</span><input [(ngModel)]="passwordForm.motDePasse" placeholder="Laisser vide si inchange" type="password" /></label>
      </div>

      <div class="action-row">
        <button class="primary-button" type="button" (click)="save.emit()" [disabled]="isSubmitting">
          {{ selectedUser ? 'Enregistrer' : 'Ajouter utilisateur' }}
        </button>
        <button class="secondary-button" type="button" *ngIf="selectedUser" (click)="changePassword.emit()" [disabled]="isSubmitting">Changer mot de passe</button>
        <button class="ghost-button" type="button" *ngIf="selectedUser" (click)="cancel.emit()">Annuler</button>
      </div>
    </section>
  `
})
export class UserFormComponent {
  @Input({ required: true }) form: any;
  @Input({ required: true }) passwordForm: any;
  @Input({ required: true }) roles: UserRole[] = [];
  @Input() selectedUser: any | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<void>();
  @Output() changePassword = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
