import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  user = {
    email: '',
    motDePasse: ''
  };
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.user.email || !this.user.motDePasse) {
      this.errorMessage = 'Saisis ton email et mot de passe';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login({
      email: this.user.email.trim(),
      motDePasse: this.user.motDePasse
    }).subscribe({
      next: (response) => {
        if (response && response.token) {
          this.authService.saveToken(response.token);
          const role = this.authService.resolveRoleFromLoginResponse(response);

          if (!role) {
            this.errorMessage = 'Role utilisateur introuvable';
            this.authService.clearSession();
            this.isSubmitting = false;
            return;
          }

          this.authService.saveRole(role);
          void this.router.navigate([this.authService.getDashboardRoute(role)]);
        } else {
          this.errorMessage = 'Login invalide';
        }

        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = this.getErrorMessage(err);
        this.isSubmitting = false;
      }
    });
  }

  getErrorMessage(err: any): string {
    if (err.status === 0) {
      return 'Backend inaccessible';
    }

    if (err.status === 401) {
      return 'Email ou mot de passe incorrect';
    }

    if (err.status === 403) {
      return 'Acces refuse';
    }

    if (err.status === 404) {
      return 'Endpoint introuvable';
    }

    return 'Erreur serveur';
  }
}
