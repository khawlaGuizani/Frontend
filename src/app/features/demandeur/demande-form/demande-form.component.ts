import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-demande-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demande-form.component.html'
})
export class DemandeFormComponent {
  @Input() role: UserRole | null = null;
  @Input() formDataMessage = '';
  @Input() sites: any[] = [];
  @Input() camions: any[] = [];
  @Input() fournisseurs: any[] = [];
  @Input() articles: any[] = [];
  @Input() nouvelleDemande: any = null;
  @Input() lignes: any[] = [];
  @Input() maxLignes = 2;
  @Input() isCreating = false;
  @Input() getArticleLabel!: (article: any) => string;
  @Input() getSelectedArticle!: (articleId: any) => any;
  @Input() getArticleStock!: (article: any) => number;
  @Input() getArticleUnit!: (article: any) => string;

  @Output() creerDemande = new EventEmitter<void>();
  @Output() addLigne = new EventEmitter<void>();
  @Output() removeLigne = new EventEmitter<number>();
  @Output() onLigneChange = new EventEmitter<any>();
}
