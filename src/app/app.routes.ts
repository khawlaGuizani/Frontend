import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DemandesComponent } from './features/demandeur/dashboard/demandes';
import { HomeComponent } from './features/dashboard/home';
import { DashboardShellComponent } from './features/dashboard/dashboard-shell.component';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { UserManagementComponent } from './features/admin/users/user-management.component';
import { ArticleManagementComponent } from './features/admin/articles/article-management.component';
import { TypeCamionManagementComponent } from './features/admin/types-camion/type-camion-management.component';
import { CamionManagementComponent } from './features/admin/camions/camion-management.component';
import { FournisseurManagementComponent } from './features/admin/fournisseurs/fournisseur-management.component';
import { SiteManagementComponent } from './features/admin/sites/site-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'dashboard',
    component: DashboardShellComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'requests' },
      { path: 'new-request', component: DemandesComponent, data: { title: 'Nouvelle demande', roles: ['DEMANDEUR'] } },
      { path: 'requests', component: DemandesComponent, data: { title: 'Demandes de transport', roles: ['DEMANDEUR', 'VALIDATEUR', 'ADMIN'] } },
      { path: 'validation', component: DemandesComponent, data: { title: 'Validation des demandes', roles: ['VALIDATEUR', 'ADMIN'] } },
      { path: 'history', component: DemandesComponent, data: { title: 'Historique des demandes', roles: ['VALIDATEUR', 'ADMIN'] } },
      { path: 'users', component: UserManagementComponent, data: { title: 'Utilisateurs', roles: ['ADMIN'] } },
      { path: 'articles', component: ArticleManagementComponent, data: { title: 'Articles', roles: ['ADMIN'] } },
      { path: 'trucks', component: TypeCamionManagementComponent, data: { title: 'Types de camion', roles: ['ADMIN'] } },
      { path: 'fleet', component: CamionManagementComponent, data: { title: 'Flotte de camions', roles: ['ADMIN'] } },
      { path: 'suppliers', component: FournisseurManagementComponent, data: { title: 'Fournisseurs', roles: ['ADMIN'] } },
      { path: 'sites', component: SiteManagementComponent, data: { title: 'Sites logistiques', roles: ['ADMIN'] } }
    ]
  },
  { path: 'demandes', redirectTo: 'dashboard/requests', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'dashboard/users', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
