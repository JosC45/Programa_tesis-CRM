import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface Student {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  rut: string;
  carrera: string;
  año_ingreso: number;
  telefono?: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService extends BaseService {

  getStudents(): Observable<Student[]> {
    return this.get<Student[]>('/services/alumnos/');
  }

  getStudent(id: number): Observable<Student> {
    return this.get<Student>(`/services/alumnos/${id}/`);
  }

  createStudent(student: Partial<Student>): Observable<Student> {
    return this.post<Student>('/services/alumnos/', student);
  }

  updateStudent(id: number, student: Partial<Student>): Observable<Student> {
    return this.put<Student>(`/services/alumnos/${id}/`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.delete<void>(`/services/alumnos/${id}/`);
  }

  getCurrentStudent(): Observable<Student> {
    // TODO: Obtener el ID del estudiante actual desde el token o auth service
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      return this.get<Student>(`/services/alumnos/?user=${currentUser.id}`);
    }
    throw new Error('Usuario no autenticado');
  }
}
