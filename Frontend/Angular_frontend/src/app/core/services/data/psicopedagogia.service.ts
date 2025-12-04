import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface Psicopedagogia {
  id: number;
  alumno: {
    id: number;
    user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
    };
    rut: string;
    carrera: string;
  };
  psicologo?: {
    id: number;
    user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
    };
    especialidad?: string;
  };
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class PsicopedagogiaService extends BaseService {

  getPsicopedagogias(): Observable<Psicopedagogia[]> {
    return this.get<Psicopedagogia[]>('/services/psicopedagogias/');
  }

  getPsicopedagogia(id: number): Observable<Psicopedagogia> {
    return this.get<Psicopedagogia>(`/services/psicopedagogias/${id}/`);
  }

  createPsicopedagogia(psicopedagogia: Partial<Psicopedagogia>): Observable<Psicopedagogia> {
    return this.post<Psicopedagogia>('/services/psicopedagogias/', psicopedagogia);
  }

  updatePsicopedagogia(id: number, psicopedagogia: Partial<Psicopedagogia>): Observable<Psicopedagogia> {
    return this.put<Psicopedagogia>(`/services/psicopedagogias/${id}/`, psicopedagogia);
  }

  deletePsicopedagogia(id: number): Observable<void> {
    return this.delete<void>(`/services/psicopedagogias/${id}/`);
  }

  getStudentPsicopedagogias(alumnoId: number): Observable<Psicopedagogia[]> {
    return this.get<Psicopedagogia[]>(`/services/psicopedagogias/?alumno=${alumnoId}`);
  }

  getPsicologoPsicopedagogias(psicologoId: number): Observable<Psicopedagogia[]> {
    return this.get<Psicopedagogia[]>(`/services/psicopedagogias/?psicologo=${psicologoId}`);
  }

  assignPsicologo(id: number, psicologoId: number): Observable<Psicopedagogia> {
    return this.patch<Psicopedagogia>(`/services/psicopedagogias/${id}/`, {
      psicologo: psicologoId
    });
  }
}
