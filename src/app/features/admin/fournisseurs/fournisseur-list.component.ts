import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel table-panel">
      <div class="panel-head table-head">
        <div>
          <h3>Liste des fournisseurs</h3>
          <p>{{ fournisseurs.length }} fournisseur(s) affiche(s)</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Fournisseur</th><th>Email</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of fournisseurs">
              <td><strong>{{ f.nom }}</strong></td>
              <td>{{ f.email }}</td>
              <td><span class="status-badge">{{ f.actif ? 'Actif' : 'Inactif' }}</span></td>
              <td class="actions-cell">
                <button class="secondary-button icon-action" type="button" (click)="edit.emit(f)">✎ <span>Modifier</span></button>
                <button class="danger-button" type="button" (click)="remove.emit(f.id)">Supprimer</button>
              </td>
            </tr>
            <tr *ngIf="fournisseurs.length === 0">
              <td colspan="4" class="empty-state">Aucun fournisseur trouve.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class FournisseurListComponent {
  @Input() fournisseurs: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
