import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../services/site.service';
import { SiteFormComponent } from './site-form.component';
import { SiteListComponent } from './site-list.component';

@Component({
  selector: 'app-site-management',
  standalone: true,
  imports: [CommonModule, SiteFormComponent, SiteListComponent],
  template: `
    <div class="alert success" *ngIf="message">{{ message }}</div>
    <div class="alert error" *ngIf="errorMessage">{{ errorMessage }}</div>
    <section class="workspace">
      <div class="section-title">
        <div><p class="eyebrow">Reseau</p><h2>Sites</h2></div>
        <button class="secondary-button" type="button" (click)="loadSites()">Actualiser</button>
      </div>
      <app-site-form [site]="site" [selectedSite]="selectedSite" [isSubmitting]="isSubmitting" (save)="selectedSite ? saveSite() : addSite()" (cancel)="cancelSiteEdit()"></app-site-form>
      <app-site-list [sites]="sites" (edit)="editSite($event)" (remove)="deleteSite($event)"></app-site-list>
    </section>
  `
})
export class SiteManagementComponent implements OnInit {
  sites: any[] = [];
  site = this.createEmptySite();
  selectedSite: any | null = null;
  isSubmitting = false;
  message = '';
  errorMessage = '';

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.siteService.getAll().subscribe({ next: (data) => (this.sites = data) });
  }

  addSite(): void {
    this.submit(() => this.siteService.create(this.site), () => {
      this.message = 'Site ajoute avec succes.';
      this.site = this.createEmptySite();
      this.loadSites();
    });
  }

  editSite(site: any): void {
    this.selectedSite = site;
    this.site = { codeSite: site.codeSite || site.code_site || '', libelle: site.libelle || '', adresse: site.adresse || '', ville: site.ville || '', actif: site.actif ?? true };
  }

  saveSite(): void {
    if (!this.selectedSite) return;
    this.submit(() => this.siteService.update(this.selectedSite.id, this.site), () => {
      this.message = 'Site modifie avec succes.';
      this.cancelSiteEdit();
      this.loadSites();
    });
  }

  deleteSite(id: number): void {
    this.deleteResource('Supprimer ce site ?', () => this.siteService.delete(id), () => {
      this.message = 'Site supprime avec succes.';
      this.loadSites();
    });
  }

  cancelSiteEdit(): void {
    this.selectedSite = null;
    this.site = this.createEmptySite();
  }

  private submit(requestFactory: () => any, onSuccess: () => void): void {
    this.isSubmitting = true;
    this.clearAlerts();
    requestFactory().subscribe({ next: () => { onSuccess(); this.isSubmitting = false; }, error: () => { this.errorMessage = 'Operation impossible. Verifie les donnees et les droits admin.'; this.isSubmitting = false; } });
  }

  private deleteResource(message: string, requestFactory: () => any, onSuccess: () => void): void {
    if (!confirm(message)) return;
    this.clearAlerts();
    requestFactory().subscribe({ next: onSuccess, error: () => (this.errorMessage = 'Suppression impossible.') });
  }

  private clearAlerts(): void {
    this.message = '';
    this.errorMessage = '';
  }

  private createEmptySite() {
    return { codeSite: '', libelle: '', adresse: '', ville: '', actif: true };
  }
}
