import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../../core/services/auth.service';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-staff-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule
  ],
  templateUrl: './staff-layout.component.html',
  styleUrl: './staff-layout.component.scss'
})
export class StaffLayoutComponent implements OnInit {
  isSidebarOpen = true;
  userName: string = 'Usuario';
  userRole: string = 'staff';

  menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: 'dashboard', route: 'dashboard' },
    { title: 'Talleres', icon: 'school', route: 'workshops' },
    { title: 'Estudiantes', icon: 'people', route: 'students' },
    { title: 'Docentes', icon: 'person', route: 'teachers' },
    { title: 'Servicios', icon: 'miscellaneous_services', route: 'services' },
    { title: 'Encuestas', icon: 'assignment', route: 'surveys' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Get user info from auth service
    const user = this.authService.currentUserValue;
    if (user) {
      this.userName = user.first_name || 'Usuario';
      this.userRole = user.role || 'staff';
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
  }
}
