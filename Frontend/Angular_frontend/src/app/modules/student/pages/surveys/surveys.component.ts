import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { SurveyService, Survey } from '../../../../core/services/data/survey.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit {
  surveys: Survey[] = [];
  currentStudentId: number | null = null;

  constructor(
    private surveyService: SurveyService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSurveys();
    this.getCurrentStudentId();
  }

  getCurrentStudentId() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.currentStudentId = currentUser.id;
    }
  }

  loadSurveys() {
    this.surveyService.getActiveSurveys().subscribe({
      next: (surveys) => {
        this.surveys = surveys;
      },
      error: (error) => {
        console.error('Error cargando encuestas:', error);
        this.snackBar.open('Error al cargar las encuestas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  takeSurvey(survey: Survey) {
    // TODO: Implementar modal o navegación para tomar la encuesta
    this.snackBar.open(`Tomando encuesta: ${survey.titulo}`, 'Cerrar', { duration: 3000 });
  }

  isSurveyCompleted(survey: Survey): boolean {
    // TODO: Verificar si el estudiante ya completó esta encuesta
    // Por ahora retornamos false
    return false;
  }
}
