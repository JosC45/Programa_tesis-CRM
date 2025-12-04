import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface Survey {
  id: number;
  titulo: string;
  descripcion?: string;
  servicio: {
    id: number;
    nombre: string;
    tipo: string;
  };
  activa: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  preguntas?: Question[];
}

export interface Question {
  id: number;
  encuesta: number;
  texto: string;
  tipo: 'texto' | 'opcion_multiple' | 'escala';
  opciones?: any;
  obligatoria: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id: number;
  alumno: number;
  pregunta: number;
  respuesta: any;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService extends BaseService {

  getSurveys(): Observable<Survey[]> {
    return this.get<Survey[]>('/services/encuestas/');
  }

  getSurvey(id: number): Observable<Survey> {
    return this.get<Survey>(`/services/encuestas/${id}/`);
  }

  createSurvey(survey: Partial<Survey>): Observable<Survey> {
    return this.post<Survey>('/services/encuestas/', survey);
  }

  updateSurvey(id: number, survey: Partial<Survey>): Observable<Survey> {
    return this.put<Survey>(`/services/encuestas/${id}/`, survey);
  }

  deleteSurvey(id: number): Observable<void> {
    return this.delete<void>(`/services/encuestas/${id}/`);
  }

  getActiveSurveys(): Observable<Survey[]> {
    return this.get<Survey[]>('/services/encuestas/?activa=true');
  }

  getSurveyQuestions(surveyId: number): Observable<Question[]> {
    return this.get<Question[]>(`/services/preguntas/?encuesta=${surveyId}`);
  }

  createQuestion(question: Partial<Question>): Observable<Question> {
    return this.post<Question>('/services/preguntas/', question);
  }

  submitSurveyResponse(response: Partial<SurveyResponse>): Observable<SurveyResponse> {
    return this.post<SurveyResponse>('/services/respuestas-encuesta/', response);
  }

  getStudentResponses(alumnoId: number): Observable<SurveyResponse[]> {
    return this.get<SurveyResponse[]>(`/services/respuestas-encuesta/?alumno=${alumnoId}`);
  }

  getSurveyResponses(surveyId: number): Observable<SurveyResponse[]> {
    return this.get<SurveyResponse[]>(`/services/respuestas-encuesta/?pregunta__encuesta=${surveyId}`);
  }
}
