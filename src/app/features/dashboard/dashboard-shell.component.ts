import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../models/user.model';

type NavItem = { label: string; icon: string; link: string; roles: UserRole[] };

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="saas-shell" [class.sidebar-collapsed]="collapsed()">
      <aside class="app-sidebar" aria-label="Navigation principale">
        <a class="app-brand" routerLink="/dashboard">
          <img class="brand-logo" src="/brand/doetker-logo.png" alt="Dr. Oetker" />
          <span class="brand-copy"><strong>TransitFlow</strong><small><b>Dr. Oetker</b> · GIAS logistics</small></span>
        </a>

        <button class="collapse-button" type="button" (click)="collapsed.set(!collapsed())" [attr.aria-label]="collapsed() ? 'Développer le menu' : 'Réduire le menu'">☰</button>

        <nav class="sidebar-nav">
          <p class="nav-label">Espace de travail</p>
          <a *ngFor="let item of visibleItems" [routerLink]="item.link" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" [attr.aria-label]="item.label">
            <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span><span class="nav-text">{{ item.label }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="role-chip"><span class="role-dot"></span><span class="nav-text">{{ role || 'Utilisateur' }}</span></div>
          <button class="logout-nav" type="button" (click)="logout()"><span aria-hidden="true">⇥</span><span class="nav-text">Déconnexion</span></button>
        </div>
      </aside>

      <div class="app-workspace">
        <header class="app-header">
          <div class="header-context"><p>TransitFlow <span>/</span> {{ pageTitle() }}</p><h1>{{ pageTitle() }}</h1></div>
          <div class="header-actions">
            <button class="header-icon" type="button" aria-label="Notifications">♧<i></i></button>
            <div class="profile-menu">
              <button class="profile-button" type="button" aria-haspopup="true" [attr.aria-expanded]="profileMenuOpen()" aria-label="Profil utilisateur" (click)="profileMenuOpen.set(!profileMenuOpen())"><span>{{ (role || 'U').charAt(0) }}</span><b class="nav-text">{{ role || 'Profil' }}</b><em aria-hidden="true">⌄</em></button>
              <div class="profile-dropdown" *ngIf="profileMenuOpen()">
                <button class="profile-dropdown-item" type="button" (click)="logout()"><span aria-hidden="true">⇥</span>Déconnexion</button>
              </div>
            </div>
          </div>
        </header>
        <main class="app-content"><router-outlet></router-outlet></main>
      </div>
    </div>
  `,
  styleUrl: './dashboard-shell.css'
})
export class DashboardShellComponent implements OnInit {
  readonly collapsed = signal(false);
  readonly pageTitle = signal('Vue d’ensemble');
  readonly profileMenuOpen = signal(false);
  role: UserRole | null = null;
  readonly items: NavItem[] = [
    { label: 'Nouvelle demande', icon: '+', link: '/dashboard/new-request', roles: ['DEMANDEUR'] },
    { label: 'Mes demandes', icon: '▣', link: '/dashboard/requests', roles: ['DEMANDEUR'] },
    { label: 'Demandes', icon: '▣', link: '/dashboard/requests', roles: ['ADMIN', 'VALIDATEUR'] },
    { label: 'Validation', icon: '✓', link: '/dashboard/validation', roles: ['ADMIN', 'VALIDATEUR'] },
    { label: 'Historique', icon: '◷', link: '/dashboard/history', roles: ['ADMIN', 'VALIDATEUR'] },
    { label: 'Utilisateurs', icon: '♙', link: '/dashboard/users', roles: ['ADMIN'] },
    { label: 'Articles', icon: '▦', link: '/dashboard/articles', roles: ['ADMIN'] },
    { label: 'Types camion', icon: '◇', link: '/dashboard/trucks', roles: ['ADMIN'] },
    { label: 'Camions', icon: '▰', link: '/dashboard/fleet', roles: ['ADMIN'] },
    { label: 'Fournisseurs', icon: '◉', link: '/dashboard/suppliers', roles: ['ADMIN'] },
    { label: 'Sites', icon: '⌖', link: '/dashboard/sites', roles: ['ADMIN'] }
  ];

  constructor(private readonly router: Router, private readonly auth: AuthService, private readonly host: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.profileMenuOpen() && !this.host.nativeElement.querySelector('.profile-menu')?.contains(event.target as Node)) {
      this.profileMenuOpen.set(false);
    }
  }
  get visibleItems(): NavItem[] { return this.items.filter((item) => !!this.role && item.roles.includes(this.role)); }
  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.updateTitle();
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => this.updateTitle());
  }
  logout(): void { this.auth.clearSession(); void this.router.navigate(['/login']); }
  private updateTitle(): void {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    this.pageTitle.set((route.data['title'] as string | undefined) || 'Vue d’ensemble');
  }
}
