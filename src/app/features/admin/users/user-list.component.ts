import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel table-panel">
      <div class="panel-head table-head">
        <div>
          <h3>Liste des utilisateurs</h3>
          <p>{{ users.length }} utilisateur(s) affiche(s)</p>
        </div>
        <label class="search-field">
          <span>Recherche</span>
          <input [(ngModel)]="searchTerm" (ngModelChange)="searchTermChange.emit($event)" placeholder="Nom, email, role ou id" />
        </label>
      </div>

      <div class="loading-state" *ngIf="isLoading">Chargement des utilisateurs...</div>
      <div class="table-wrap" *ngIf="!isLoading">
        <table>
          <thead>
            <tr><th>Collaborateur</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users; trackBy: trackByUserId">
              <td><span class="user-avatar">{{ u.nom?.charAt(0) || 'U' }}</span><strong>{{ u.nom }}</strong><small class="user-id">#{{ u.id }}</small></td>
              <td>{{ u.email }}</td>
              <td><span class="role-badge">{{ u.role }}</span></td>
              <td><span class="status-badge">Actif</span></td>
              <td class="actions-cell">
                <button class="secondary-button icon-action" type="button" (click)="edit.emit(u)">✎ <span>Modifier</span></button>
                <button class="danger-button" type="button" (click)="remove.emit(u.id)" [disabled]="deletingUserId === u.id">
                  {{ deletingUserId === u.id ? 'Suppression...' : 'Supprimer' }}
                </button>
              </td>
            </tr>
            <tr *ngIf="users.length === 0">
              <td colspan="5" class="empty-state">Aucun utilisateur trouve pour cette recherche.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class UserListComponent {
  @Input() users: any[] = [];
  @Input() isLoading = false;
  @Input() deletingUserId: number | null = null;
  @Input() searchTerm = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();

  trackByUserId(_: number, user: any): number {
    return user.id;
  }
}
