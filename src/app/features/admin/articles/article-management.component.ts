import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { ArticleFormComponent } from './article-form.component';
import { ArticleListComponent } from './article-list.component';

@Component({
  selector: 'app-article-management',
  standalone: true,
  imports: [CommonModule, ArticleFormComponent, ArticleListComponent],
  template: `
    <div class="alert success" *ngIf="message">{{ message }}</div>
    <div class="alert error" *ngIf="errorMessage">{{ errorMessage }}</div>
    <section class="workspace">
      <div class="section-title">
        <div><p class="eyebrow">Stock</p><h2>Gestion des articles</h2></div>
        <span class="count-pill">{{ articles.length }} articles</span>
      </div>
      <app-article-form [article]="article" [selectedArticle]="selectedArticle" [isSubmitting]="isSubmitting" (save)="selectedArticle ? saveArticle() : addArticle()" (cancel)="cancelArticleEdit()"></app-article-form>
      <app-article-list [articles]="articles" (edit)="editArticle($event)" (remove)="deleteArticle($event)"></app-article-list>
    </section>
  `
})
export class ArticleManagementComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();
  articles: any[] = [];
  article = this.createEmptyArticle();
  selectedArticle: any | null = null;
  isSubmitting = false;
  message = '';
  errorMessage = '';

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getAll().subscribe({ next: (data) => (this.articles = data) });
  }

  addArticle(): void {
    this.submit(() => this.articleService.create(this.article), () => {
      this.message = 'Article ajoute avec succes.';
      this.article = this.createEmptyArticle();
      this.reload();
    });
  }

  editArticle(article: any): void {
    this.selectedArticle = article;
    this.article = { codeArticle: article.codeArticle || article.code_article || '', unit: article.unit || article.unite || '', quantite: article.quantite ?? 0 };
  }

  saveArticle(): void {
    if (!this.selectedArticle) return;
    this.submit(() => this.articleService.update(this.selectedArticle.id, this.article), () => {
      this.message = 'Article modifie avec succes.';
      this.cancelArticleEdit();
      this.reload();
    });
  }

  deleteArticle(id: number): void {
    this.deleteResource('Supprimer cet article ?', () => this.articleService.delete(id), () => {
      this.message = 'Article supprime avec succes.';
      this.reload();
    });
  }

  cancelArticleEdit(): void {
    this.selectedArticle = null;
    this.article = this.createEmptyArticle();
  }

  private submit(requestFactory: () => any, onSuccess: () => void): void {
    this.isSubmitting = true;
    this.clearAlerts();
    requestFactory().subscribe({ next: () => { onSuccess(); this.isSubmitting = false; }, error: () => { this.errorMessage = 'Operation impossible. Verifie les donnees et les droits admin.'; this.isSubmitting = false; } });
  }

  private deleteResource(message: string, requestFactory: () => any, onSuccess: () => void): void {
    if (!confirm(message)) return;
    this.clearAlerts();
    requestFactory().subscribe({ next: onSuccess, error: () => (this.errorMessage = 'Suppression impossible.') });
  }

  private reload(): void {
    this.loadArticles();
    this.changed.emit();
  }

  private clearAlerts(): void {
    this.message = '';
    this.errorMessage = '';
  }

  private createEmptyArticle() {
    return { codeArticle: '', unit: '', quantite: 0 };
  }
}
