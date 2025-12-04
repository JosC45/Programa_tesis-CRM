import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'taller' | 'psicopedagogia' | 'otro';
  activo: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService extends BaseService {

  getServices(): Observable<Service[]> {
    return this.get<Service[]>('/services/servicios/');
  }

  getService(id: number): Observable<Service> {
    return this.get<Service>(`/services/servicios/${id}/`);
  }

  createService(service: Partial<Service>): Observable<Service> {
    return this.post<Service>('/services/servicios/', service);
  }

  updateService(id: number, service: Partial<Service>): Observable<Service> {
    return this.put<Service>(`/services/servicios/${id}/`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.delete<void>(`/services/servicios/${id}/`);
  }

  getActiveServices(): Observable<Service[]> {
    return this.get<Service[]>('/services/servicios/?activo=true');
  }
}
