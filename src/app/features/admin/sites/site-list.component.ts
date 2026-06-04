import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-site-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel list-panel">
      <div class="list-row" *ngFor="let s of sites">
        <div>
          <strong>{{ s.codeSite || s.code_site }} - {{ s.libelle }}</strong>
          <span>{{ s.ville || '-' }}</span>
        </div>
        <div class="action-row">
          <button class="secondary-button" type="button" (click)="edit.emit(s)">Modifier</button>
          <button class="danger-button" type="button" (click)="remove.emit(s.id)">Supprimer</button>
        </div>
      </div>
    </section>
  `
})
export class SiteListComponent {
  @Input() sites: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<number>();
}
