import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-camion-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel table-panel">
      <div class="panel-head table-head">
        <div>
          <h3>Liste des camions</h3>
          <p>{{ camions.length }} camion(s) affiche(s)</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Immatriculation</th><th>Capacite</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of camions">
              <td><strong>{{ c.immatriculation }}</strong></td>
              <td>{{ c.capaciteReelle || c.capacite_reelle || c.capacite }}</td>
              <td><span class="status-badge">{{ c.disponible ? 'Disponible' : 'Indisponible' }}</span></td>
              <td class="actions-cell">
                <button class="secondary-button icon-action" type="button" (click)="edit.emit(c)">✎ <span>Modifier</span></button>
                <button class="danger-button" type="button" (click)="remove.emit(c.id)">Supprimer</button>
              </td>
            </tr>
            <tr *ngIf="camions.length === 0">
              <td colspan="4" class="empty-state">Aucun camion trouve.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class CamionListComponent {
  @Input() camions: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
