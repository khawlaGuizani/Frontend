import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-type-camion-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel table-panel">
      <div class="panel-head table-head">
        <div>
          <h3>Liste des types de camion</h3>
          <p>{{ typesCamion.length }} type(s) affiche(s)</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Libelle</th><th>Capacite max</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of typesCamion">
              <td><strong>{{ t.libelle }}</strong></td>
              <td>{{ t.capaciteMax || t.capacite_max }}</td>
              <td>{{ t.description || '-' }}</td>
              <td class="actions-cell">
                <button class="secondary-button icon-action" type="button" (click)="edit.emit(t)">✎ <span>Modifier</span></button>
                <button class="danger-button" type="button" (click)="remove.emit(t.id)">Supprimer</button>
              </td>
            </tr>
            <tr *ngIf="typesCamion.length === 0">
              <td colspan="4" class="empty-state">Aucun type de camion trouve.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class TypeCamionListComponent {
  @Input() typesCamion: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
