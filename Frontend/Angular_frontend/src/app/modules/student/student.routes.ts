import { Routes } from '@angular/router';
import { StudentLayoutComponent } from './layout/student-layout/student-layout.component';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    children: [
      {
        path: 'workshops',
        loadComponent: () => import('./pages/workshops/workshops.component').then(m => m.WorkshopsComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'surveys',
        loadComponent: () => import('./pages/surveys/surveys.component').then(m => m.SurveysComponent)
      },
      {
        path: 'psicopedagogias',
        loadComponent: () => import('./pages/psicopedagogias/psicopedagogias.component').then(m => m.PsicopedagogiasComponent)
      },
      {
        path: '',
        redirectTo: 'workshops',
        pathMatch: 'full'
      }
    ]
  }
];
