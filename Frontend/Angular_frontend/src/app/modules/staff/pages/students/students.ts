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
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { StudentService, Student } from '../../../../core/services/data/student.service';
import { StudentModalComponent } from '../../../../shared/components/modals/student-modal/student-modal.component';

@Component({
  selector: 'app-students',
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
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class Students implements OnInit {
  students = new MatTableDataSource<Student>([]);
  displayedColumns: string[] = ['rut', 'nombre', 'email', 'carrera', 'ano_ingreso', 'telefono', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  ngAfterViewInit() {
    this.students.paginator = this.paginator;
    this.students.sort = this.sort;
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students.data = students;
      },
      error: (error) => {
        console.error('Error cargando estudiantes:', error);
        this.snackBar.open('Error al cargar los estudiantes', 'Cerrar', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.students.filter = filterValue.trim().toLowerCase();
  }

  createStudent() {
    const dialogRef = this.dialog.open(StudentModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents();
      }
    });
  }

  editStudent(student: Student) {
    const dialogRef = this.dialog.open(StudentModalComponent, {
      width: '600px',
      data: { student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents();
      }
    });
  }

  deleteStudent(student: Student) {
    if (confirm(`¿Estás seguro de eliminar al estudiante ${student.user.first_name} ${student.user.last_name}?`)) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          this.snackBar.open('Estudiante eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error eliminando estudiante:', error);
          this.snackBar.open('Error al eliminar el estudiante', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  viewStudentDetails(student: Student) {
    // TODO: Implementar vista de detalles del estudiante
    this.snackBar.open(`Ver detalles de: ${student.user.first_name} ${student.user.last_name}`, 'Cerrar', { duration: 3000 });
  }
}
