import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TeacherService, Teacher } from '../../../../core/services/data/teacher.service';
import { TeacherModalComponent } from '../../../../shared/components/modals/teacher-modal/teacher-modal.component';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  templateUrl: './teachers.html',
  styleUrl: './teachers.css'
})
export class Teachers implements OnInit {
  teachers = new MatTableDataSource<Teacher>([]);
  displayedColumns: string[] = ['rut', 'nombre', 'email', 'telefono', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private teacherService: TeacherService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTeachers();
  }

  ngAfterViewInit() {
    this.teachers.paginator = this.paginator;
    this.teachers.sort = this.sort;
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers.data = teachers;
      },
      error: (error) => {
        console.error('Error cargando docentes:', error);
        this.snackBar.open('Error al cargar los docentes', 'Cerrar', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.teachers.filter = filterValue.trim().toLowerCase();
  }

  createTeacher() {
    const dialogRef = this.dialog.open(TeacherModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTeachers();
      }
    });
  }

  editTeacher(teacher: Teacher) {
    const dialogRef = this.dialog.open(TeacherModalComponent, {
      width: '600px',
      data: { teacher }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTeachers();
      }
    });
  }

  deleteTeacher(teacher: Teacher) {
    if (confirm(`¿Estás seguro de eliminar al docente ${teacher.user.first_name} ${teacher.user.last_name}?`)) {
      this.teacherService.deleteTeacher(teacher.id).subscribe({
        next: () => {
          this.snackBar.open('Docente eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadTeachers();
        },
        error: (error) => {
          console.error('Error eliminando docente:', error);
          this.snackBar.open('Error al eliminar el docente', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  viewTeacherDetails(teacher: Teacher) {
    // TODO: Implementar vista de detalles del docente
    this.snackBar.open(`Ver detalles de: ${teacher.user.first_name} ${teacher.user.last_name}`, 'Cerrar', { duration: 3000 });
  }
}
