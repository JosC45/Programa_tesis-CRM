import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { WorkshopService, Workshop } from '../../../../core/services/data/workshop.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-workshops',
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
    MatSnackBarModule
  ],
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.css']
})
export class WorkshopsComponent implements OnInit {
  workshops = new MatTableDataSource<Workshop>([]);
  displayedColumns: string[] = ['nombre', 'ciclo', 'cupos_disponibles', 'fecha_inicio', 'fecha_fin', 'acciones'];
  currentStudentId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private workshopService: WorkshopService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadWorkshops();
    this.getCurrentStudentId();
  }

  ngAfterViewInit() {
    this.workshops.paginator = this.paginator;
    this.workshops.sort = this.sort;
  }

  getCurrentStudentId() {
    // TODO: Obtener el ID del estudiante desde el perfil
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Asumimos que el ID del usuario coincide con el ID del perfil de estudiante
      // En una implementación real, deberíamos obtener el perfil de estudiante
      this.currentStudentId = currentUser.id;
    }
  }

  loadWorkshops() {
    this.workshopService.getWorkshops().subscribe({
      next: (workshops) => {
        // Filtrar solo talleres activos con cupos disponibles
        const availableWorkshops = workshops.filter(w => w.activo && w.cupos_disponibles > 0);
        this.workshops.data = availableWorkshops;
      },
      error: (error) => {
        console.error('Error cargando talleres:', error);
        this.snackBar.open('Error al cargar los talleres', 'Cerrar', { duration: 3000 });
      }
    });
  }

  enrollWorkshop(workshop: Workshop) {
    if (!this.currentStudentId) {
      this.snackBar.open('Error: No se pudo identificar al estudiante', 'Cerrar', { duration: 3000 });
      return;
    }

    this.workshopService.enrollStudent(workshop.id, this.currentStudentId).subscribe({
      next: (enrollment) => {
        this.snackBar.open('¡Te has matriculado exitosamente en el taller!', 'Cerrar', { duration: 3000 });
        // Recargar talleres para actualizar cupos
        this.loadWorkshops();
      },
      error: (error) => {
        console.error('Error en matrícula:', error);
        let errorMessage = 'Error al matricularse en el taller';

        if (error.error?.detail) {
          errorMessage = error.error.detail;
        } else if (error.error?.non_field_errors) {
          errorMessage = error.error.non_field_errors[0];
        }

        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
