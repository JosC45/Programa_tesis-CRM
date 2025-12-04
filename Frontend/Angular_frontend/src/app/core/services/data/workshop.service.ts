import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface Workshop {
  id: number;
  nombre_taller: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  servicio: {
    id: number;
    nombre: string;
    tipo: string;
  };
  ciclo: {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
  };
  cupos: number;
  cupos_disponibles: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface WorkshopEnrollment {
  id: number;
  taller: number;
  alumno: number;
  estado: string;
  calificacion?: number;
  asistencia: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkshopService extends BaseService {

  getWorkshops(): Observable<Workshop[]> {
    return this.get<Workshop[]>('/services/talleres/');
  }

  getWorkshop(id: number): Observable<Workshop> {
    return this.get<Workshop>(`/services/talleres/${id}/`);
  }

  createWorkshop(workshop: Partial<Workshop>): Observable<Workshop> {
    return this.post<Workshop>('/services/talleres/', workshop);
  }

  updateWorkshop(id: number, workshop: Partial<Workshop>): Observable<Workshop> {
    return this.put<Workshop>(`/services/talleres/${id}/`, workshop);
  }

  deleteWorkshop(id: number): Observable<void> {
    return this.delete<void>(`/services/talleres/${id}/`);
  }

  enrollStudent(tallerId: number, alumnoId: number): Observable<WorkshopEnrollment> {
    return this.post<WorkshopEnrollment>('/services/talleres-alumnos/', {
      taller: tallerId,
      alumno: alumnoId
    });
  }

  getStudentEnrollments(alumnoId: number): Observable<WorkshopEnrollment[]> {
    return this.get<WorkshopEnrollment[]>(`/services/talleres-alumnos/?alumno=${alumnoId}`);
  }

  getWorkshopEnrollments(tallerId: number): Observable<WorkshopEnrollment[]> {
    return this.get<WorkshopEnrollment[]>(`/services/talleres-alumnos/?taller=${tallerId}`);
  }

  updateEnrollment(id: number, data: Partial<WorkshopEnrollment>): Observable<WorkshopEnrollment> {
    return this.put<WorkshopEnrollment>(`/services/talleres-alumnos/${id}/`, data);
  }
}
