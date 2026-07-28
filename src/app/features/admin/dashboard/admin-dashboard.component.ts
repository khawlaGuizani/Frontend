import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleManagementComponent } from '../articles/article-management.component';
import { CamionManagementComponent } from '../camions/camion-management.component';
import { FournisseurManagementComponent } from '../fournisseurs/fournisseur-management.component';
import { SiteManagementComponent } from '../sites/site-management.component';
import { TypeCamionManagementComponent } from '../types-camion/type-camion-management.component';
import { UserManagementComponent } from '../users/user-management.component';
import { AuthService } from '../../../core/services/auth.service';
import { ArticleService } from '../../../services/article.service';
import { CamionService } from '../../../services/camion.service';

type AdminSection = 'users' | 'articles' | 'typesCamion' | 'camions' | 'fournisseurs' | 'sites';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    UserManagementComponent,
    ArticleManagementComponent,
    TypeCamionManagementComponent,
    CamionManagementComponent,
    FournisseurManagementComponent,
    SiteManagementComponent
  ],
  template: `
    <section class="admin-shell">
      <aside class="admin-sidebar">
        <div class="brand-block">
          <span class="brand-mark">↗</span>
          <div>
            <strong>TransitFlow</strong>
            <small>Logistics platform</small>
          </div>
        </div>

        <nav class="admin-nav" aria-label="Navigation administration">
          <button type="button" [class.active]="activeSection === 'users'" (click)="activeSection = 'users'"><i>♙</i> Utilisateurs</button>
          <button type="button" [class.active]="activeSection === 'articles'" (click)="activeSection = 'articles'"><i>▦</i> Articles</button>
          <button type="button" [class.active]="activeSection === 'typesCamion'" (click)="activeSection = 'typesCamion'"><i>◇</i> Types camion</button>
          <button type="button" [class.active]="activeSection === 'camions'" (click)="activeSection = 'camions'"><i>▰</i> Camions</button>
          <button type="button" [class.active]="activeSection === 'fournisseurs'" (click)="activeSection = 'fournisseurs'"><i>◉</i> Fournisseurs</button>
          <button type="button" [class.active]="activeSection === 'sites'" (click)="activeSection = 'sites'"><i>⌖</i> Sites</button>
        </nav>

        <button class="logout-button" type="button" (click)="logout()">⇥ Déconnexion</button>
      </aside>

      <main class="admin-main">
        <header class="admin-topbar">
          <div>
            <p class="eyebrow">Administration / Vue d'ensemble</p>
            <h1>Centre de pilotage</h1>
          </div>

          <div class="topbar-actions">
            <button class="notification-button" type="button" aria-label="Notifications">◌</button>
            <div class="admin-avatar">A</div>
            <div class="quick-stats">
            <span>{{ usersCount }} utilisateurs</span>
            <span>{{ articlesCount }} articles</span>
            <span>{{ camionsCount }} camions</span>
            </div>
          </div>
        </header>

        <app-user-management *ngIf="activeSection === 'users'" (changed)="loadStats()"></app-user-management>
        <app-article-management *ngIf="activeSection === 'articles'" (changed)="loadStats()"></app-article-management>
        <app-type-camion-management *ngIf="activeSection === 'typesCamion'"></app-type-camion-management>
        <app-camion-management *ngIf="activeSection === 'camions'" (changed)="loadStats()"></app-camion-management>
        <app-fournisseur-management *ngIf="activeSection === 'fournisseurs'"></app-fournisseur-management>
        <app-site-management *ngIf="activeSection === 'sites'"></app-site-management>
      </main>
    </section>
  `,
  styleUrl: '../admin.css',
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements OnInit {
  activeSection: AdminSection = 'users';
  usersCount = 0;
  articlesCount = 0;
  camionsCount = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private articleService: ArticleService,
    private camionService: CamionService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.authService.getUsers().subscribe({ next: (users) => (this.usersCount = users.length), error: () => (this.usersCount = 0) });
    this.articleService.getAll().subscribe({ next: (articles) => (this.articlesCount = articles.length), error: () => (this.articlesCount = 0) });
    this.camionService.getAll().subscribe({ next: (camions) => (this.camionsCount = camions.length), error: () => (this.camionsCount = 0) });
  }

  logout(): void {
    this.authService.clearSession();
    void this.router.navigate(['/login']);
  }
}
