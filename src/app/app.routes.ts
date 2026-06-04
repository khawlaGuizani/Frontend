import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { DemandesComponent } from './features/demandeur/dashboard/demandes';
import { HomeComponent } from './features/dashboard/home';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

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
    path: 'demandes',
    component: DemandesComponent,
    canActivate: [authGuard],
    data: { roles: ['DEMANDEUR', 'VALIDATEUR', 'ADMIN'] }
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '**', redirectTo: '' }
];
