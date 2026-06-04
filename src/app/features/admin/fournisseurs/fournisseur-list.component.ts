import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel list-panel">
      <div class="list-row" *ngFor="let f of fournisseurs">
        <div>
          <strong>{{ f.nom }}</strong>
          <span>{{ f.email }} - {{ f.actif ? 'Actif' : 'Inactif' }}</span>
        </div>
        <div class="action-row">
          <button class="secondary-button" type="button" (click)="edit.emit(f)">Modifier</button>
          <button class="danger-button" type="button" (click)="remove.emit(f.id)">Supprimer</button>
        </div>
      </div>
    </section>
  `
})
export class FournisseurListComponent {
  @Input() fournisseurs: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
