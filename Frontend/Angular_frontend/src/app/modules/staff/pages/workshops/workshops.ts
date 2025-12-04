import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { WorkshopService, Workshop, WorkshopEnrollment } from '../../../../core/services/data/workshop.service';
import { PsicopedagogiaService } from '../../../../core/services/data/psicopedagogia.service';

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
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  templateUrl: './workshops.html',
  styleUrl: './workshops.css'
})
export class Workshops implements OnInit {
  workshops = new MatTableDataSource<Workshop>([]);
  enrollments = new MatTableDataSource<WorkshopEnrollment>([]);
  displayedColumns: string[] = ['nombre', 'ciclo', 'cupos', 'cupos_disponibles', 'fecha_inicio', 'fecha_fin', 'activo', 'acciones'];
  enrollmentColumns: string[] = ['alumno', 'estado', 'calificacion', 'asistencia', 'acciones'];

  selectedWorkshop: Workshop | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private workshopService: WorkshopService,
    private psicopedagogiaService: PsicopedagogiaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadWorkshops();
  }

  ngAfterViewInit() {
    this.workshops.paginator = this.paginator;
    this.workshops.sort = this.sort;
  }

  loadWorkshops() {
    this.workshopService.getWorkshops().subscribe({
      next: (workshops) => {
        this.workshops.data = workshops;
      },
      error: (error) => {
        console.error('Error cargando talleres:', error);
        this.snackBar.open('Error al cargar los talleres', 'Cerrar', { duration: 3000 });
      }
    });
  }

  viewEnrollments(workshop: Workshop) {
    this.selectedWorkshop = workshop;
    this.workshopService.getWorkshopEnrollments(workshop.id).subscribe({
      next: (enrollments) => {
        this.enrollments.data = enrollments;
      },
      error: (error) => {
        console.error('Error cargando matrículas:', error);
        this.snackBar.open('Error al cargar las matrículas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  assignPsicopedagogia(enrollment: WorkshopEnrollment) {
    // TODO: Implementar asignación de psicopedagogía
    this.snackBar.open('Funcionalidad de asignar psicopedagogía en desarrollo', 'Cerrar', { duration: 3000 });
  }

  updateEnrollmentStatus(enrollment: WorkshopEnrollment, newStatus: string) {
    const updatedEnrollment = { ...enrollment, estado: newStatus };
    this.workshopService.updateEnrollment(enrollment.id, updatedEnrollment).subscribe({
      next: () => {
        this.snackBar.open('Estado de matrícula actualizado', 'Cerrar', { duration: 3000 });
        if (this.selectedWorkshop) {
          this.viewEnrollments(this.selectedWorkshop);
        }
      },
      error: (error) => {
        console.error('Error actualizando matrícula:', error);
        this.snackBar.open('Error al actualizar la matrícula', 'Cerrar', { duration: 3000 });
      }
    });
  }

  toggleWorkshopStatus(workshop: Workshop) {
    const updatedWorkshop = { ...workshop, activo: !workshop.activo };
    this.workshopService.updateWorkshop(workshop.id, updatedWorkshop).subscribe({
      next: () => {
        this.snackBar.open(`Taller ${updatedWorkshop.activo ? 'activado' : 'desactivado'}`, 'Cerrar', { duration: 3000 });
        this.loadWorkshops();
      },
      error: (error) => {
        console.error('Error actualizando taller:', error);
        this.snackBar.open('Error al actualizar el taller', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getEnrollmentStatusColor(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'primary';
      case 'reprobado': return 'warn';
      case 'retirado': return 'accent';
      case 'inscrito': return 'basic';
      default: return 'basic';
    }
  }

  getEnrollmentStatusLabel(estado: string): string {
    switch (estado) {
      case 'aprobado': return 'Aprobado';
      case 'reprobado': return 'Reprobado';
      case 'retirado': return 'Retirado';
      case 'inscrito': return 'Inscrito';
      default: return estado;
    }
  }
}
