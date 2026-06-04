import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../../models/user.model';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const role = authService.getRole();
  const allowedRoles = route.data?.['roles'] as UserRole[] | undefined;

  if (!allowedRoles || (role && allowedRoles.includes(role))) {
    return true;
  }

  return router.createUrlTree([authService.getDashboardRoute(role)]);
};
