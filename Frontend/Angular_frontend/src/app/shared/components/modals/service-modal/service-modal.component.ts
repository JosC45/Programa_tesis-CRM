import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService, Service } from '../../../../core/services/data/service.service';

@Component({
  selector: 'app-service-modal',
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
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.css']
})
export class ServiceModalComponent {
  serviceForm: FormGroup;
  isEditing = false;
  title = 'Crear Servicio';

  serviceTypes = [
    { value: 'taller', label: 'Taller' },
    { value: 'psicopedagogia', label: 'Psicopedagogía' },
    { value: 'otro', label: 'Otro' }
  ];

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private dialogRef: MatDialogRef<ServiceModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { service?: Service }
  ) {
    this.isEditing = !!data?.service;
    this.title = this.isEditing ? 'Editar Servicio' : 'Crear Servicio';

    this.serviceForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipo: ['', Validators.required],
      activo: [true]
    });

    if (this.isEditing && data.service) {
      this.loadServiceData(data.service);
    }
  }

  loadServiceData(service: Service) {
    this.serviceForm.patchValue({
      nombre: service.nombre,
      descripcion: service.descripcion,
      tipo: service.tipo,
      activo: service.activo
    });
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      const formValue = this.serviceForm.value;

      if (this.isEditing && this.data.service) {
        // Actualizar servicio existente
        this.serviceService.updateService(this.data.service.id, formValue).subscribe({
          next: (updatedService) => {
            this.snackBar.open('Servicio actualizado correctamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(updatedService);
          },
          error: (error) => {
            console.error('Error actualizando servicio:', error);
            this.snackBar.open('Error al actualizar el servicio', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        // Crear nuevo servicio
        this.serviceService.createService(formValue).subscribe({
          next: (newService) => {
            this.snackBar.open('Servicio creado correctamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(newService);
          },
          error: (error) => {
            console.error('Error creando servicio:', error);
            this.snackBar.open('Error al crear el servicio', 'Cerrar', { duration: 3000 });
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.serviceForm.controls).forEach(key => {
      const control = this.serviceForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.serviceForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `Longitud mínima: ${minLength} caracteres`;
    }
    return '';
  }
}
