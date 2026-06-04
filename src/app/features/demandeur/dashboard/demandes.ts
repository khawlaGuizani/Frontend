import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, timeout } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../models/user.model';
import { ArticleService } from '../../../services/article.service';
import { CamionService } from '../../../services/camion.service';
import { DemandeService } from '../../../services/demande.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { SiteService } from '../../../services/site.service';
import { DemandeFormComponent } from '../demande-form/demande-form.component';
import { DemandeListComponent } from '../demande-list/demande-list.component';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [CommonModule, FormsModule, DemandeFormComponent, DemandeListComponent],
  templateUrl: './demandes.html',
  styleUrls: ['./demandes.css'],
  encapsulation: ViewEncapsulation.None
})
export class DemandesComponent implements OnInit, OnDestroy {
  demandes: any[] = [];
  demandesTraitees: any[] = [];
  demandesValidees: any[] = [];
  demandesRejetees: any[] = [];
  role: UserRole | null = null;
  isLoading = false;
  isLoadingTraitees = false;
  errorMessage = '';
  successMessage = '';
  formDataMessage = '';
  loadingEndpoint = '';
  motifRejet: Record<number, string> = {};
  processingDemandeId: number | null = null;
  private loadingTimer: ReturnType<typeof setTimeout> | null = null;
  isCreating = false;
  readonly maxLignes = 2;

  sites: any[] = [];
  camions: any[] = [];
  fournisseurs: any[] = [];
  articles: any[] = [];

  nouvelleDemande = this.createEmptyDemande();
  lignes: any[] = [];

  getArticleLabelFn = (article: any) => this.getArticleLabel(article);
  getSelectedArticleFn = (articleId: number | null) => this.getSelectedArticle(articleId);
  getArticleStockFn = (article: any) => this.getArticleStock(article);
  getArticleUnitFn = (article: any) => this.getArticleUnit(article);
  getDemandeurLabelFn = (demande: any) => this.getDemandeurLabel(demande);
  getDateCreationFn = (demande: any) => this.getDateCreation(demande);
  getSiteLabelFn = (site: any, fallback: unknown) => this.getSiteLabel(site, fallback);
  getCamionLabelFn = (demande: any) => this.getCamionLabel(demande);
  getFournisseurLabelFn = (demande: any) => this.getFournisseurLabel(demande);
  getLigneArticleLabelFn = (ligne: any) => this.getLigneArticleLabel(ligne);
  getMotifRejetFn = (demande: any) => this.getMotifRejet(demande);
  getValidateurLabelFn = (demande: any) => this.getValidateurLabel(demande);

  constructor(
    private demandeService: DemandeService,
    private authService: AuthService,
    private router: Router,
    private siteService: SiteService,
    private camionService: CamionService,
    private fournisseurService: FournisseurService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    if (this.role === 'DEMANDEUR') {
      this.loadFormData();
      this.addLigne();
    } else if (this.role === 'VALIDATEUR' || this.role === 'ADMIN') {
      this.loadArticles();
    }
    this.refreshDemandes();
  }

  ngOnDestroy(): void {
    this.clearLoadingTimer();
  }

  refreshDemandes(): void {
    this.loadDemandes();

    if (this.role === 'VALIDATEUR' || this.role === 'ADMIN') {
      this.loadDemandesTraitees();
    }
  }

  loadDemandes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.loadingEndpoint = this.getDemandesEndpoint();
    this.clearLoadingTimer();

    this.loadingTimer = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.errorMessage = `Le backend ne repond pas: ${this.loadingEndpoint}`;
      }
    }, 15000);

    const request =
      this.role === 'DEMANDEUR'
        ? this.demandeService.getMesDemandes()
        : this.role === 'VALIDATEUR'
          ? this.demandeService.getEnAttente()
          : this.demandeService.getAll();

    request.pipe(timeout(15000)).subscribe({
      next: (data: any[]) => {
        this.clearLoadingTimer();
        this.demandes = this.normalizeDemandes(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.clearLoadingTimer();
        console.error(err);
        this.errorMessage =
          err?.name === 'TimeoutError'
            ? `Le backend ne repond pas: ${this.loadingEndpoint}`
            : 'Impossible de charger les demandes.';
        this.isLoading = false;
      }
    });
  }

  loadDemandesTraitees(): void {
    this.isLoadingTraitees = true;

    forkJoin([
      this.demandeService.getAll('VALIDE'),
      this.demandeService.getAll('REJETE')
    ]).pipe(timeout(15000)).subscribe({
      next: ([validees, rejetees]) => {
        this.demandesValidees = this.sortDemandesTraitees(this.normalizeDemandes(validees));
        this.demandesRejetees = this.sortDemandesTraitees(this.normalizeDemandes(rejetees));
        this.demandesTraitees = [...this.demandesValidees, ...this.demandesRejetees].sort((a, b) => {
          const dateA = new Date(a.dateValidation || a['date_validation'] || 0).getTime();
          const dateB = new Date(b.dateValidation || b['date_validation'] || 0).getTime();
          return dateB - dateA;
        });
        this.isLoadingTraitees = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoadingTraitees = false;
      }
    });
  }

  loadFormData(): void {
    this.siteService.getAll().subscribe({ next: (data) => (this.sites = data) });
    this.camionService.getAll().subscribe({ next: (data) => (this.camions = data) });
    this.fournisseurService.getAll().subscribe({ next: (data) => (this.fournisseurs = data) });
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
        this.formDataMessage = data.length ? '' : 'Aucun article trouve.';
      },
      error: (err) => {
        console.error(err);
        this.formDataMessage = this.getArticleLoadError(err);
      }
    });
  }

  getArticleLoadError(err: any): string {
    if (err?.status === 403) {
      return "Acces refuse aux articles pour ce role. Autorise DEMANDEUR cote backend sur l'endpoint articles.";
    }

    if (err?.status === 404) {
      return "Endpoint articles introuvable: /api/articles.";
    }

    if (err?.status === 0) {
      return "Backend inaccessible pour charger les articles.";
    }

    return `Impossible de charger la liste des articles${err?.status ? ` (HTTP ${err.status})` : ''}.`;
  }

  getArticleLabel(article: any): string {
    return (
      article?.codeArticle ||
      article?.code_article ||
      article?.code ||
      article?.libelle ||
      `Article ${article?.id}`
    );
  }

  getSelectedArticle(articleId: number | null): any | null {
    if (!articleId) {
      return null;
    }

    return this.articles.find((article) => Number(article.id) === Number(articleId)) || null;
  }

  getArticleStock(article: any): number {
    return Number(article?.quantite ?? article?.stock ?? 0);
  }

  getArticleUnit(article: any): string {
    return article?.unit || article?.unite || '';
  }

  onLigneChange(ligne: any): void {
    const article = this.getSelectedArticle(ligne.articleId);
    if (!article || ligne.type !== 'SORTIE') {
      return;
    }

    const stock = this.getArticleStock(article);
    if (ligne.quantite > stock) {
      ligne.quantite = stock;
      this.errorMessage = `Stock disponible limite a ${stock} pour ${this.getArticleCode(article)}.`;
    }
  }

  addLigne(): void {
    if (this.lignes.length >= this.maxLignes) {
      this.errorMessage = 'Tu peux ajouter au maximum deux articles par demande.';
      return;
    }

    this.lignes.push({
      articleId: null,
      quantite: 1,
      type: 'SORTIE'
    });
  }

  removeLigne(index: number): void {
    this.lignes.splice(index, 1);
  }

  creerDemande(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.nouvelleDemande.libelle ||
      !this.nouvelleDemande.capacite ||
      !this.nouvelleDemande.siteDepartId ||
      !this.nouvelleDemande.siteArriveeId
    ) {
      this.errorMessage = 'Merci de remplir libelle, capacite, site depart et site arrivee.';
      return;
    }

    const lignesValides = this.lignes.filter((ligne) => ligne.articleId && ligne.quantite > 0);
    if (lignesValides.length > this.maxLignes) {
      this.errorMessage = 'Tu peux envoyer au maximum deux articles par demande.';
      return;
    }

    const stockError = this.getStockError(lignesValides);
    if (stockError) {
      this.errorMessage = stockError;
      return;
    }

    const payload = {
      ...this.nouvelleDemande,
      lignes: lignesValides
    };

    this.isCreating = true;
    this.demandeService.create(payload).subscribe({
      next: () => {
        this.successMessage = 'Demande creee avec succes.';
        this.nouvelleDemande = this.createEmptyDemande();
        this.lignes = [];
        this.addLigne();
        this.isCreating = false;
        this.refreshDemandes();
        this.loadFormData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Creation de la demande impossible.';
        this.isCreating = false;
      }
    });
  }

 valider(id: number): void {

  this.errorMessage = '';
  this.successMessage = '';
  this.processingDemandeId = id;

  this.demandeService.valider(id).subscribe({

    next: (demande) => {

      //this.updateArticlesStock(demande);

      // 🔥 téléchargement CSV
      this.demandeService.downloadCsv(id)
        .subscribe((blob: Blob) => {

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');

          a.href = url;

          a.download = `TRG_${id}.csv`;

          a.click();

          window.URL.revokeObjectURL(url);
        });

      this.successMessage = `Demande #${id} validée.`;

      this.processingDemandeId = null;

      this.refreshDemandes();
    },

    error: (err) => {

      console.error(err);

      this.errorMessage = 'Validation impossible.';

      this.processingDemandeId = null;
    }
  });
}


  rejeter(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    const motif = this.motifRejet[id]?.trim();
    if (!motif) {
      this.errorMessage = 'Motif obligatoire pour rejeter une demande.';
      return;
    }

    this.processingDemandeId = id;
    this.demandeService.rejeter(id, motif).subscribe({
      next: () => {
        this.successMessage = `Demande #${id} rejetee.`;
        this.markDemandeRejected(id, motif);
        delete this.motifRejet[id];
        this.processingDemandeId = null;
        this.refreshDemandes();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Rejet impossible.';
        this.processingDemandeId = null;
      }
    });
  }

  getDemandeurLabel(demande: any): string {
    const explicitDemandeur =
      demande?.demandeurNom ||
      demande?.demandeur_nom ||
      demande?.nomDemandeur ||
      demande?.nom_demandeur ||
      demande?.createdBy?.nom ||
      demande?.createdBy?.email ||
      demande?.created_by?.nom ||
      demande?.created_by?.email ||
      demande?.createur?.nom ||
      demande?.createur?.email ||
      demande?.utilisateurDemandeur?.nom ||
      demande?.utilisateurDemandeur?.email;

    if (explicitDemandeur) {
      return explicitDemandeur;
    }

    if (this.isDemandeTraitee(demande) && this.hasValidationActor(demande)) {
      return demande?.demandeurId || demande?.['demandeur_id'] || '-';
    }

    return (
      demande?.demandeur?.nom ||
      demande?.demandeur?.email ||
      demande?.demandeurId ||
      demande?.['demandeur_id'] ||
      '-'
    );
  }

  getValidateurLabel(demande: any): string {
    return (
      demande?.validateur?.nom ||
      demande?.validateur?.email ||
      demande?.validator?.nom ||
      demande?.validator?.email ||
      demande?.validePar?.nom ||
      demande?.validePar?.email ||
      demande?.valide_par?.nom ||
      demande?.valide_par?.email ||
      demande?.validatedBy?.nom ||
      demande?.validatedBy?.email ||
      demande?.validated_by?.nom ||
      demande?.validated_by?.email ||
      demande?.validateurNom ||
      demande?.validateur_nom ||
      demande?.nomValidateur ||
      demande?.nom_validateur ||
      (this.isDemandeTraitee(demande) ? demande?.demandeur?.nom || demande?.demandeur?.email : '') ||
      demande?.validateurId ||
      demande?.['validateur_id'] ||
      '-'
    );
  }

  getSiteLabel(site: any, fallback: unknown): string {
    return site?.libelle || site?.codeSite || site?.code_site || site?.id || String(fallback || '-');
  }

  getCamionLabel(demande: any): string {
    return (
      demande?.camion?.immatriculation ||
      demande?.camion?.id ||
      demande?.camionId ||
      demande?.['camion_id'] ||
      '-'
    );
  }

  getFournisseurLabel(demande: any): string {
    return (
      demande?.fournisseur?.nom ||
      demande?.fournisseur?.id ||
      demande?.fournisseurId ||
      demande?.['fournisseur_id'] ||
      '-'
    );
  }

  getLigneArticleLabel(ligne: any): string {
    return this.getArticleLabel(ligne?.article || ligne);
  }

  getMotifRejet(demande: any): string {
    return (
      demande?.motif ||
      demande?.motifRejet ||
      demande?.motif_rejet ||
      demande?.raisonRejet ||
      demande?.raison_rejet ||
      demande?.motifRefus ||
      demande?.motif_refus ||
      demande?.causeRejet ||
      demande?.cause_rejet ||
      demande?.descriptionRejet ||
      demande?.description_rejet ||
      'Motif non renseigne'
    );
  }

  getDateCreation(demande: any): string | Date | null {
    return (
      demande?.dateDemande ||
      demande?.date_demande ||
      demande?.dateCreation ||
      demande?.date_creation ||
      demande?.createdAt ||
      demande?.created_at ||
      demande?.dateValidation ||
      demande?.date_validation ||
      null
    );
  }

  logout(): void {
    this.authService.clearSession();
    void this.router.navigate(['/login']);
  }

  private getDemandesEndpoint(): string {
    if (this.role === 'DEMANDEUR') {
      return '/api/demandes/mes-demandes';
    }

    if (this.role === 'VALIDATEUR') {
      return '/api/demandes/en-attente';
    }

    return '/api/demandes/all';
  }

  private clearLoadingTimer(): void {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
  }

  private normalizeDemandes(demandes: any[]): any[] {
    return demandes.map((demande) => this.normalizeDemande(demande));
  }

  private normalizeDemande(demande: any): any {
    const motif = this.getMotifRejetValue(demande);

    if (!motif || demande?.motifRejet) {
      return demande;
    }

    return {
      ...demande,
      motifRejet: motif
    };
  }

  private markDemandeRejected(id: number, motif: string): void {
    const update = (demande: any) =>
      demande?.id === id
        ? {
            ...demande,
            statut: demande.statut || 'REJETE',
            status: demande.status || 'REJETE',
            motifRejet: motif,
            motif
          }
        : demande;

    this.demandes = this.demandes.map(update);
    this.demandesTraitees = this.demandesTraitees.map(update);
    this.demandesRejetees = this.demandesRejetees.map(update);
    this.demandesValidees = this.demandesValidees.map(update);
  }

  private sortDemandesTraitees(demandes: any[]): any[] {
    return demandes.sort((a, b) => {
      const dateA = new Date(a.dateValidation || a['date_validation'] || 0).getTime();
      const dateB = new Date(b.dateValidation || b['date_validation'] || 0).getTime();
      return dateB - dateA;
    });
  }

  private isDemandeTraitee(demande: any): boolean {
    return demande?.statut === 'VALIDE' || demande?.status === 'VALIDE' || demande?.statut === 'REJETE' || demande?.status === 'REJETE';
  }

  private hasValidationActor(demande: any): boolean {
    return !!(
      demande?.validateur ||
      demande?.validator ||
      demande?.validePar ||
      demande?.valide_par ||
      demande?.validatedBy ||
      demande?.validated_by ||
      demande?.validateurNom ||
      demande?.validateur_nom ||
      demande?.nomValidateur ||
      demande?.nom_validateur ||
      demande?.demandeur?.nom ||
      demande?.demandeur?.email
    );
  }

  private getMotifRejetValue(demande: any): string {
    return (
      demande?.motif ||
      demande?.motifRejet ||
      demande?.motif_rejet ||
      demande?.raisonRejet ||
      demande?.raison_rejet ||
      demande?.motifRefus ||
      demande?.motif_refus ||
      demande?.causeRejet ||
      demande?.cause_rejet ||
      demande?.descriptionRejet ||
      demande?.description_rejet ||
      ''
    );
  }

  private getStockError(lignes: any[]): string | null {
    for (const ligne of lignes) {
      const article = this.getSelectedArticle(ligne.articleId);
      if (!article || ligne.type !== 'SORTIE') {
        continue;
      }

      const stock = this.getArticleStock(article);
      if (ligne.quantite > stock) {
        return `Stock insuffisant pour ${this.getArticleCode(article)}. Disponible: ${stock}.`;
      }
    }

    return null;
  }

  private getArticleCode(article: any): string {
    return (
      article?.codeArticle ||
      article?.code_article ||
      article?.code ||
      article?.libelle ||
      `Article ${article?.id}`
    );
  }

  private getLigneArticleId(ligne: any): number | null {
    const id =
      ligne?.articleId ??
      ligne?.article_id ??
      ligne?.idArticle ??
      ligne?.id_article ??
      ligne?.article?.id ??
      null;

    return id ? Number(id) : null;
  }

  private getLigneType(ligne: any, demande: any): string {
    return (
      ligne?.type ||
      ligne?.typeTransaction ||
      ligne?.type_transaction ||
      demande?.typeTransaction ||
      demande?.type_transaction ||
      'SORTIE'
    );
  }

  private createEmptyDemande() {
    return {
      libelle: '',
      capacite: 0,
      typeTransaction: 'SORTIE',
      siteDepartId: null,
      siteArriveeId: null,
      camionId: null,
      fournisseurId: null
    };
  }
}
