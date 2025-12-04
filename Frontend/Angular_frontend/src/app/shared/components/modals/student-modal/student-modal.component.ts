import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { StudentService, Student } from '../../../../core/services/data/student.service';

@Component({
  selector: 'app-student-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './student-modal.component.html',
  styleUrls: ['./student-modal.component.css']
})
export class StudentModalComponent {
  studentForm: FormGroup;
  isEditing = false;
  title = 'Crear Estudiante';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private dialogRef: MatDialogRef<StudentModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { student?: Student }
  ) {
    this.isEditing = !!data?.student;
    this.title = this.isEditing ? 'Editar Estudiante' : 'Crear Estudiante';

    this.studentForm = this.fb.group({
      user: this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        password: ['', this.isEditing ? [] : [Validators.required, Validators.minLength(6)]]
      }),
      rut: ['', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]$/)]],
      carrera: ['', Validators.required],
      año_ingreso: ['', [Validators.required, Validators.min(2000), Validators.max(new Date().getFullYear())]],
      telefono: ['']
    });

    if (this.isEditing && data.student) {
      this.loadStudentData(data.student);
    }
  }

  loadStudentData(student: Student) {
    this.studentForm.patchValue({
      user: {
        username: student.user.username,
        email: student.user.email,
        first_name: student.user.first_name,
        last_name: student.user.last_name
      },
      rut: student.rut,
      carrera: student.carrera,
      año_ingreso: student.año_ingreso,
      telefono: student.telefono
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;

      if (this.isEditing && this.data.student) {
        // Actualizar estudiante existente
        this.studentService.updateStudent(this.data.student.id, formValue).subscribe({
          next: (updatedStudent) => {
            this.snackBar.open('Estudiante actualizado correctamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(updatedStudent);
          },
          error: (error) => {
            console.error('Error actualizando estudiante:', error);
            this.snackBar.open('Error al actualizar el estudiante', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        // Crear nuevo estudiante
        this.studentService.createStudent(formValue).subscribe({
          next: (newStudent) => {
            this.snackBar.open('Estudiante creado correctamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(newStudent);
          },
          error: (error) => {
            console.error('Error creando estudiante:', error);
            this.snackBar.open('Error al crear el estudiante', 'Cerrar', { duration: 3000 });
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.studentForm.controls).forEach(key => {
      const control = this.studentForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.studentForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return 'Longitud mínima no cumplida';
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    return '';
  }
}
