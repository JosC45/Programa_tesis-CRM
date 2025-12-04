import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'];
  const userRole = authService.getUserRole();

  // Si no está autenticado, redirigir al login
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Si está autenticado pero no tiene el rol correcto, mostrar página de no autorizado
  if (userRole !== expectedRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
