import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  user = {
    nom: '',
    email: '',
    motDePasse: '',
    role: 'DEMANDEUR'
  };

  constructor(private authService: AuthService) {}

  createUser(): void {
    this.authService.register(this.user).subscribe({
      next: () => {
        alert('Utilisateur ajoute avec succes');
        this.user = {
          nom: '',
          email: '',
          motDePasse: '',
          role: 'DEMANDEUR'
        };
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Erreur lors de la creation');
      }
    });
  }
}
