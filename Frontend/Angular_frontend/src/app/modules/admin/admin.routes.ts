import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { WorkshopsListComponent } from './components/workshops/workshops-list/workshops-list.component';
import { TeachersListComponent } from './components/teachers/teachers-list/teachers-list.component';
import { StudentsListComponent } from './components/students/students-list/students-list.component';
import { ServicesListComponent } from './components/services/services-list/services-list.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'workshops', component: WorkshopsListComponent },
      { path: 'teachers', component: TeachersListComponent },
      { path: 'students', component: StudentsListComponent },
      { path: 'services', component: ServicesListComponent },
    ]
  }
];
