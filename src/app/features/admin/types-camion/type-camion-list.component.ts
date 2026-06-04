import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-type-camion-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel list-panel">
      <div class="list-row" *ngFor="let t of typesCamion">
        <div>
          <strong>{{ t.libelle }}</strong>
          <span>{{ t.capaciteMax || t.capacite_max }} - {{ t.description || '-' }}</span>
        </div>
        <div class="action-row">
          <button class="secondary-button" type="button" (click)="edit.emit(t)">Modifier</button>
          <button class="danger-button" type="button" (click)="remove.emit(t.id)">Supprimer</button>
        </div>
      </div>
    </section>
  `
})
export class TypeCamionListComponent {
  @Input() typesCamion: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
