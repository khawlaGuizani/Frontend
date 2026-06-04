import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-camion-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel list-panel">
      <div class="list-row" *ngFor="let c of camions">
        <div>
          <strong>{{ c.immatriculation }}</strong>
          <span>{{ c.capaciteReelle || c.capacite_reelle || c.capacite }} - {{ c.disponible ? 'Disponible' : 'Indisponible' }}</span>
        </div>
        <div class="action-row">
          <button class="secondary-button" type="button" (click)="edit.emit(c)">Modifier</button>
          <button class="danger-button" type="button" (click)="remove.emit(c.id)">Supprimer</button>
        </div>
      </div>
    </section>
  `
})
export class CamionListComponent {
  @Input() camions: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
