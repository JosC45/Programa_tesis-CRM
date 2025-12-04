import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface Teacher {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  rut: string;
  telefono?: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService extends BaseService {

  getTeachers(): Observable<Teacher[]> {
    return this.get<Teacher[]>('/services/docentes/');
  }

  getTeacher(id: number): Observable<Teacher> {
    return this.get<Teacher>(`/services/docentes/${id}/`);
  }

  createTeacher(teacher: Partial<Teacher>): Observable<Teacher> {
    return this.post<Teacher>('/services/docentes/', teacher);
  }

  updateTeacher(id: number, teacher: Partial<Teacher>): Observable<Teacher> {
    return this.put<Teacher>(`/services/docentes/${id}/`, teacher);
  }

  deleteTeacher(id: number): Observable<void> {
    return this.delete<void>(`/services/docentes/${id}/`);
  }
}
