import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['username', 'email', 'full_name', 'role', 'is_active', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.users.paginator = this.paginator;
    this.users.sort = this.sort;
  }

  loadUsers() {
    // TODO: Implementar llamada al servicio de usuarios
    this.snackBar.open('Funcionalidad de gestión de usuarios en desarrollo', 'Cerrar', { duration: 3000 });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }

  toggleUserStatus(user: User) {
    // TODO: Implementar cambio de estado
    this.snackBar.open('Funcionalidad en desarrollo', 'Cerrar', { duration: 3000 });
  }

  editUser(user: User) {
    // TODO: Implementar edición
    this.snackBar.open('Funcionalidad en desarrollo', 'Cerrar', { duration: 3000 });
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'warn';
      case 'staff': return 'primary';
      case 'student': return 'accent';
      default: return 'basic';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'staff': return 'Personal';
      case 'student': return 'Estudiante';
      default: return role;
    }
  }
}
