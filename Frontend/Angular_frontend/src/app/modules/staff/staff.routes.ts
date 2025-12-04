import { Routes } from '@angular/router';
import { StaffLayoutComponent } from './layout/staff-layout/staff-layout.component';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    component: StaffLayoutComponent,
    children: [
      {
        path: 'workshops',
        loadComponent: () => import('./pages/workshops/workshops').then(m => m.Workshops)
      },
      {
        path: 'students',
        loadComponent: () => import('./pages/students/students').then(m => m.Students)
      },
      {
        path: 'teachers',
        loadComponent: () => import('./pages/teachers/teachers').then(m => m.Teachers)
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services').then(m => m.Services)
      },
      {
        path: 'surveys',
        loadComponent: () => import('./pages/surveys/surveys').then(m => m.Surveys)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
