import { Routes } from '@angular/router';
import { StaffLayoutComponent } from './layout/staff-layout.component';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    component: StaffLayoutComponent,
    children: [
      {
        path: 'workshops',
        loadComponent: () => import('./pages/workshops/workshops.component').then(m => m.WorkshopsComponent)
      },
      {
        path: 'students',
        loadComponent: () => import('./pages/students/students.component').then(m => m.StudentsComponent)
      },
      {
        path: 'teachers',
        loadComponent: () => import('./pages/teachers/teachers.component').then(m => m.TeachersComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'surveys',
        loadComponent: () => import('./pages/surveys/surveys.component').then(m => m.SurveysComponent)
      },
      { path: '', redirectTo: 'workshops', pathMatch: 'full' }
    ]
  }
];
