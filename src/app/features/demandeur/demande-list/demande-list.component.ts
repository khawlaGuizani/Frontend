import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-demande-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demande-list.component.html'
})
export class DemandeListComponent {
  @Input() role: UserRole | null = null;
  @Input() demandes: any[] = [];
  @Input() demandesTraitees: any[] = [];
  @Input() demandesValidees: any[] = [];
  @Input() demandesRejetees: any[] = [];
  @Input() isLoading = false;
  @Input() isLoadingTraitees = false;
  @Input() processingDemandeId: number | null = null;
  @Input() motifRejet: Record<number, string> = {};

  @Input() getDemandeurLabel!: (demande: any) => string;
  @Input() getDateCreation!: (demande: any) => string | Date | null;
  @Input() getSiteLabel!: (site: any, fallback: unknown) => string;
  @Input() getCamionLabel!: (demande: any) => string;
  @Input() getFournisseurLabel!: (demande: any) => string;
  @Input() getLigneArticleLabel!: (ligne: any) => string;
  @Input() getMotifRejet!: (demande: any) => string;
  @Input() getValidateurLabel!: (demande: any) => string;

  @Output() valider = new EventEmitter<number>();
  @Output() rejeter = new EventEmitter<number>();
  @Output() refreshDemandes = new EventEmitter<void>();
}
