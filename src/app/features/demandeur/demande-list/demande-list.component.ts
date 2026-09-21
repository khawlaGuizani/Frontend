import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-demande-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demande-list.component.html'
})
export class DemandeListComponent implements OnChanges {
  @Input() view: 'create' | 'requests' | 'validation' | 'history' = 'requests';
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

  validationTab: 'pending' | 'approved' | 'rejected' = 'pending';
  readonly pageSize = 6;
  readonly articlePageSize = 3;
  currentPage = 1;
  articlePages: Record<string, number> = {};

  get displayedDemandes(): any[] {
    if (this.view === 'requests') return this.demandes;
    if (this.validationTab === 'approved') return this.demandesValidees;
    if (this.validationTab === 'rejected') return this.demandesRejetees;
    return this.demandes;
  }

  get isValidator(): boolean { return this.role === 'VALIDATEUR' || this.role === 'ADMIN'; }

  getArticlePageKey(demande: any): string {
    return String(demande?.id ?? demande?.reference ?? 'unknown');
  }

  getArticlePage(demande: any): number {
    const totalPages = this.getArticleTotalPages(demande);
    const key = this.getArticlePageKey(demande);
    const page = Math.min(this.articlePages[key] || 1, totalPages);
    this.articlePages[key] = page;
    return page;
  }

  getArticleTotalPages(demande: any): number {
    return Math.max(1, Math.ceil((demande?.lignes?.length || 0) / this.articlePageSize));
  }

  getArticlePages(demande: any): number[] {
    return Array.from({ length: this.getArticleTotalPages(demande) }, (_, index) => index + 1);
  }

  getPagedArticles(demande: any): any[] {
    const page = this.getArticlePage(demande);
    const start = (page - 1) * this.articlePageSize;
    return (demande?.lignes || []).slice(start, start + this.articlePageSize);
  }

  setArticlePage(demande: any, page: number): void {
    const totalPages = this.getArticleTotalPages(demande);
    this.articlePages[this.getArticlePageKey(demande)] = Math.max(1, Math.min(page, totalPages));
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.displayedDemandes.length / this.pageSize));
  }

  get pagedDemandes(): any[] {
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    const start = (this.currentPage - 1) * this.pageSize;
    return this.displayedDemandes.slice(start, start + this.pageSize);
  }

  get firstDisplayedIndex(): number {
    return this.displayedDemandes.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get lastDisplayedIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.displayedDemandes.length);
  }

  selectValidationTab(tab: 'pending' | 'approved' | 'rejected'): void {
    this.validationTab = tab;
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['view']) {
      if (this.view === 'history') this.validationTab = 'approved';
      this.currentPage = 1;
    }

    if (changes['demandes'] || changes['demandesValidees'] || changes['demandesRejetees']) {
      this.currentPage = 1;
    }
  }

  statusClass(demande: any): string {
    const status = demande?.statut || demande?.status || 'EN_ATTENTE';
    return status === 'VALIDE' ? 'is-approved' : status === 'REJETE' ? 'is-rejected' : 'is-pending';
  }
}
