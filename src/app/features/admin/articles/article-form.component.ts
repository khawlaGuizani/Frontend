import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel resource-panel">
      <div class="form-grid compact">
        <label><span>Code article</span><input [(ngModel)]="article.codeArticle" placeholder="Code Article" /></label>
        <label><span>Unite</span><input [(ngModel)]="article.unit" placeholder="Unite" /></label>
        <label><span>Quantite</span><input [(ngModel)]="article.quantite" type="number" placeholder="Quantite" /></label>
      </div>
      <div class="action-row">
        <button class="primary-button" type="button" (click)="save.emit()" [disabled]="isSubmitting">
          {{ selectedArticle ? 'Enregistrer article' : 'Ajouter article' }}
        </button>
        <button class="ghost-button" type="button" *ngIf="selectedArticle" (click)="cancel.emit()">Annuler</button>
      </div>
    </section>
  `
})
export class ArticleFormComponent {
  @Input({ required: true }) article: any;
  @Input() selectedArticle: any | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
