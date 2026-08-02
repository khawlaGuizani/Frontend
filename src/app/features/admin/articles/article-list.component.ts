import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel table-panel">
      <div class="panel-head table-head">
        <div>
          <h3>Liste des articles</h3>
          <p>{{ articles.length }} article(s) affiche(s)</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Code article</th><th>Quantite</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of articles">
              <td><strong>{{ a.codeArticle || a.code_article }}</strong></td>
              <td>{{ a.quantite }} {{ a.unit || a.unite }}</td>
              <td class="actions-cell">
                <button class="secondary-button icon-action" type="button" (click)="edit.emit(a)">✎ <span>Modifier</span></button>
                <button class="danger-button" type="button" (click)="remove.emit(a.id)">Supprimer</button>
              </td>
            </tr>
            <tr *ngIf="articles.length === 0">
              <td colspan="3" class="empty-state">Aucun article trouve.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class ArticleListComponent {
  @Input() articles: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
