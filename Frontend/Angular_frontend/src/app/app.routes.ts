import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'services',
    canActivate: [authGuard, roleGuard],
    data: { role: 'staff' },
    loadChildren: () => import('./modules/servicios/staff.routes').then(m => m.STAFF_ROUTES)
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' },
    loadChildren: () => import('./modules/student/student.routes').then(m => m.STUDENT_ROUTES)
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
