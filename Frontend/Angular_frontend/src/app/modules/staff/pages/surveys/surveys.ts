import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { SurveyService, Survey, SurveyResponse } from '../../../../core/services/data/survey.service';

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './surveys.html',
  styleUrl: './surveys.css'
})
export class Surveys implements OnInit {
  surveys = new MatTableDataSource<Survey>([]);
  displayedColumns: string[] = ['titulo', 'servicio', 'activa', 'fecha_creacion', 'total_responses', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private surveyService: SurveyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSurveys();
  }

  ngAfterViewInit() {
    this.surveys.paginator = this.paginator;
    this.surveys.sort = this.sort;
  }

  loadSurveys() {
    this.surveyService.getSurveys().subscribe({
      next: (surveys) => {
        // Agregar estadísticas de respuestas a cada encuesta
        const surveysWithStats = surveys.map(survey => ({
          ...survey,
          total_responses: 0 // En una implementación real, se contaría aquí
        }));
        this.surveys.data = surveysWithStats;
      },
      error: (error) => {
        console.error('Error cargando encuestas:', error);
        this.snackBar.open('Error al cargar las encuestas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.surveys.filter = filterValue.trim().toLowerCase();
  }

  createSurvey() {
    // TODO: Implementar modal de creación de encuesta
    this.snackBar.open('Funcionalidad de crear encuesta en desarrollo', 'Cerrar', { duration: 3000 });
  }

  editSurvey(survey: Survey) {
    // TODO: Implementar modal de edición de encuesta
    this.snackBar.open(`Editar encuesta: ${survey.titulo}`, 'Cerrar', { duration: 3000 });
  }

  toggleSurveyStatus(survey: Survey) {
    const updatedSurvey = { ...survey, activa: !survey.activa };
    this.surveyService.updateSurvey(survey.id, updatedSurvey).subscribe({
      next: () => {
        this.snackBar.open(`Encuesta ${updatedSurvey.activa ? 'activada' : 'desactivada'}`, 'Cerrar', { duration: 3000 });
        this.loadSurveys();
      },
      error: (error) => {
        console.error('Error actualizando encuesta:', error);
        this.snackBar.open('Error al actualizar la encuesta', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteSurvey(survey: Survey) {
    if (confirm(`¿Estás seguro de eliminar la encuesta "${survey.titulo}"?`)) {
      this.surveyService.deleteSurvey(survey.id).subscribe({
        next: () => {
          this.snackBar.open('Encuesta eliminada correctamente', 'Cerrar', { duration: 3000 });
          this.loadSurveys();
        },
        error: (error) => {
          console.error('Error eliminando encuesta:', error);
          this.snackBar.open('Error al eliminar la encuesta', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  viewSurveyResults(survey: Survey) {
    // TODO: Implementar vista de resultados detallados
    this.snackBar.open(`Ver resultados de: ${survey.titulo}`, 'Cerrar', { duration: 3000 });
  }

  duplicateSurvey(survey: Survey) {
    // TODO: Implementar duplicación de encuesta
    this.snackBar.open(`Duplicar encuesta: ${survey.titulo}`, 'Cerrar', { duration: 3000 });
  }

  getResponseCount(survey: Survey): number {
    // TODO: Implementar conteo real de respuestas
    return 0;
  }
}
