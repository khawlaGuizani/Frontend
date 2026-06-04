import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel list-panel">
      <div class="list-row" *ngFor="let a of articles">
        <div>
          <strong>{{ a.codeArticle || a.code_article }}</strong>
          <span>{{ a.quantite }} {{ a.unit || a.unite }}</span>
        </div>
        <div class="action-row">
          <button class="secondary-button" type="button" (click)="edit.emit(a)">Modifier</button>
          <button class="danger-button" type="button" (click)="remove.emit(a.id)">Supprimer</button>
        </div>
      </div>
    </section>
  `
})
export class ArticleListComponent {
  @Input() articles: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
