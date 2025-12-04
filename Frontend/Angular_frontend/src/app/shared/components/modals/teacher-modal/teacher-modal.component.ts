import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TeacherService, Teacher } from '../../../../core/services/data/teacher.service';

@Component({
  selector: 'app-teacher-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './teacher-modal.component.html',
  styleUrls: ['./teacher-modal.component.css']
})
export class TeacherModalComponent {
  teacherForm: FormGroup;
  isEditing = false;
  title = 'Crear Docente';

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private dialogRef: MatDialogRef<TeacherModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { teacher?: Teacher }
  ) {
    this.isEditing = !!data?.teacher;
    this.title = this.isEditing ? 'Editar Docente' : 'Crear Docente';

    this.teacherForm = this.fb.group({
      user: this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        password: ['', this.isEditing ? [] : [Validators.required, Validators.minLength(6)]]
      }),
      rut: ['', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]$/)]],
      telefono: ['']
    });

    if (this.isEditing && data.teacher) {
      this.loadTeacherData(data.teacher);
    }
  }

  loadTeacherData(teacher: Teacher) {
    this.teacherForm.patchValue({
      user: {
        username: teacher.user.username,
        email: teacher.user.email,
        first_name: teacher.user.first_name,
        last_name: teacher.user.last_name
      },
      rut: teacher.rut,
      telefono: teacher.telefono
    });
  }

  onSubmit() {
    if (this.teacherForm.valid) {
      const formValue = this.teacherForm.value;

      if (this.isEditing && this.data.teacher) {
        // Actualizar docente existente
        this.teacherService.updateTeacher(this.data.teacher.id, formValue).subscribe({
          next: (updatedTeacher) => {
            this.snackBar.open('Docente actualizado correctamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(updatedTeacher);
          },
          error: (error) => {
            console.error('Error actualizando docente:', error);
            this.snackBar.open('Error al actualizar el docente', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        // Crear nuevo docente
        this.teacherService.createTeacher(formValue).subscribe({
          next: (newTeacher) => {
            this.snackBar.open('Docente creado correctamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(newTeacher);
          },
          error: (error) => {
            console.error('Error creando docente:', error);
            this.snackBar.open('Error al crear el docente', 'Cerrar', { duration: 3000 });
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.teacherForm.controls).forEach(key => {
      const control = this.teacherForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.teacherForm.get(fieldName);
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
