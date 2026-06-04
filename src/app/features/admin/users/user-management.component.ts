import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../models/user.model';
import { UserFormComponent } from './user-form.component';
import { UserListComponent } from './user-list.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, UserFormComponent, UserListComponent],
  template: `
    <div class="alert success" *ngIf="message">{{ message }}</div>
    <div class="alert error" *ngIf="errorMessage">{{ errorMessage }}</div>

    <section class="workspace">
      <div class="section-title">
        <div><p class="eyebrow">Comptes</p><h2>Gestion des utilisateurs</h2></div>
        <button class="secondary-button" type="button" (click)="loadUsers()">Actualiser</button>
      </div>

      <div class="admin-grid">
        <app-user-form [form]="selectedUser ? editedUser : user" [passwordForm]="passwordForm" [roles]="roles" [selectedUser]="selectedUser" [isSubmitting]="isSubmitting" (save)="selectedUser ? saveUser() : addUser()" (changePassword)="changePassword()" (cancel)="cancelEdit()"></app-user-form>
      </div>

      <app-user-list [users]="filteredUsers" [isLoading]="isLoading" [deletingUserId]="deletingUserId" [(searchTerm)]="searchTerm" (edit)="editUser($event)" (remove)="deleteUser($event)"></app-user-list>
    </section>
  `
})
export class UserManagementComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();
  readonly roles: UserRole[] = ['ADMIN', 'DEMANDEUR', 'VALIDATEUR'];
  users: any[] = [];
  searchTerm = '';
  isLoading = false;
  isSubmitting = false;
  deletingUserId: number | null = null;
  message = '';
  errorMessage = '';
  user = this.createEmptyUser();
  selectedUser: any | null = null;
  editedUser = this.createEmptyEditUser();
  passwordForm = { motDePasse: '' };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get filteredUsers(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    return term ? this.users.filter((user) => `${user.id} ${user.nom} ${user.email} ${user.role}`.toLowerCase().includes(term)) : this.users;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.clearAlerts();
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les utilisateurs.';
        this.isLoading = false;
      }
    });
  }

  addUser(): void {
    if (!this.user.nom || !this.user.email || !this.user.motDePasse) {
      this.errorMessage = 'Merci de remplir le nom, email et mot de passe.';
      return;
    }
    this.submit(() => this.authService.register(this.user), () => {
      this.message = 'Utilisateur ajoute avec succes.';
      this.user = this.createEmptyUser();
      this.reload();
    });
  }

  editUser(user: any): void {
    this.clearAlerts();
    this.selectedUser = user;
    this.editedUser = { nom: user.nom, email: user.email, role: user.role };
    this.passwordForm = { motDePasse: '' };
  }

  saveUser(): void {
    if (!this.selectedUser) return;
    this.submit(() => this.authService.updateUser(this.selectedUser.id, this.editedUser), () => {
      this.message = 'Utilisateur modifie avec succes.';
      this.cancelEdit();
      this.reload();
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    this.deletingUserId = id;
    this.clearAlerts();
    this.authService.deleteUser(id).subscribe({
      next: () => {
        this.message = 'Utilisateur supprime avec succes.';
        this.deletingUserId = null;
        this.reload();
      },
      error: () => {
        this.errorMessage = 'Suppression impossible.';
        this.deletingUserId = null;
      }
    });
  }

  changePassword(): void {
    if (!this.selectedUser || !this.passwordForm.motDePasse) {
      this.errorMessage = 'Saisis un nouveau mot de passe.';
      return;
    }
    this.submit(() => this.authService.changePassword(this.selectedUser.id, this.passwordForm), () => {
      this.message = 'Mot de passe modifie avec succes.';
      this.passwordForm = { motDePasse: '' };
    });
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.editedUser = this.createEmptyEditUser();
    this.passwordForm = { motDePasse: '' };
  }

  private submit(requestFactory: () => any, onSuccess: () => void): void {
    this.isSubmitting = true;
    this.clearAlerts();
    requestFactory().subscribe({
      next: () => {
        onSuccess();
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Operation impossible. Verifie les donnees et les droits admin.';
        this.isSubmitting = false;
      }
    });
  }

  private reload(): void {
    this.loadUsers();
    this.changed.emit();
  }

  private clearAlerts(): void {
    this.message = '';
    this.errorMessage = '';
  }

  private createEmptyUser() {
    return { nom: '', email: '', motDePasse: '', role: 'DEMANDEUR' as UserRole };
  }

  private createEmptyEditUser() {
    return { nom: '', email: '', role: 'DEMANDEUR' as UserRole };
  }
}
