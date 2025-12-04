import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.scss']
})
export class StudentLayoutComponent {
  menuItems = [
    { path: '/student/workshops', icon: 'school', label: 'Talleres' },
    { path: '/student/services', icon: 'work', label: 'Servicios' },
    { path: '/student/surveys', icon: 'assignment', label: 'Encuestas' },
    { path: '/student/psicopedagogias', icon: 'psychology', label: 'Psicopedagogías' }
  ];

  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}
