import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-site-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel table-panel">
      <div class="panel-head table-head">
        <div>
          <h3>Liste des sites</h3>
          <p>{{ sites.length }} site(s) affiche(s)</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Code</th><th>Libelle</th><th>Ville</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of sites">
              <td><strong>{{ s.codeSite || s.code_site }}</strong></td>
              <td>{{ s.libelle }}</td>
              <td>{{ s.ville || '-' }}</td>
              <td class="actions-cell">
                <button class="secondary-button icon-action" type="button" (click)="edit.emit(s)">✎ <span>Modifier</span></button>
                <button class="danger-button" type="button" (click)="remove.emit(s.id)">Supprimer</button>
              </td>
            </tr>
            <tr *ngIf="sites.length === 0">
              <td colspan="4" class="empty-state">Aucun site trouve.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class SiteListComponent {
  @Input() sites: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
