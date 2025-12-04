import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ViewChild } from '@angular/core';

import { SurveyService, Survey, SurveyResponse } from '../../../../core/services/data/survey.service';
import { WorkshopService, Workshop } from '../../../../core/services/data/workshop.service';
import { StudentService } from '../../../../core/services/data/student.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estadísticas generales
  stats = {
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
    totalWorkshops: 0,
    activeWorkshops: 0,
    totalStudents: 0
  };

  // Datos para gráficos
  surveyResponseChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Respuestas por Encuesta',
      backgroundColor: 'rgba(25, 118, 210, 0.2)',
      borderColor: 'rgba(25, 118, 210, 1)',
      borderWidth: 1
    }]
  };

  workshopEnrollmentChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Matrículas por Taller',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderColor: 'rgba(76, 175, 80, 1)',
      borderWidth: 1
    }]
  };

  surveyTypeChartData: ChartConfiguration['data'] = {
    labels: ['Talleres', 'Psicopedagogía', 'Otros'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#1976d2', '#4caf50', '#ff9800'],
      hoverBackgroundColor: ['#1565c0', '#388e3c', '#f57c00']
    }]
  };

  // Configuración de gráficos
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  // Tabla de encuestas recientes
  recentSurveys = new MatTableDataSource<Survey>([]);
  displayedColumns: string[] = ['titulo', 'servicio', 'activa', 'total_responses'];

  constructor(
    private surveyService: SurveyService,
    private workshopService: WorkshopService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    this.recentSurveys.paginator = this.paginator;
    this.recentSurveys.sort = this.sort;
  }

  loadDashboardData() {
    // Cargar estadísticas generales
    this.loadGeneralStats();

    // Cargar datos para gráficos
    this.loadSurveyResponseData();
    this.loadWorkshopEnrollmentData();
    this.loadServiceTypeData();

    // Cargar encuestas recientes
    this.loadRecentSurveys();
  }

  loadGeneralStats() {
    // Estadísticas de encuestas
    this.surveyService.getSurveys().subscribe(surveys => {
      this.stats.totalSurveys = surveys.length;
      this.stats.activeSurveys = surveys.filter(s => s.activa).length;
    });

    // Estadísticas de talleres
    this.workshopService.getWorkshops().subscribe(workshops => {
      this.stats.totalWorkshops = workshops.length;
      this.stats.activeWorkshops = workshops.filter(w => w.activo).length;
    });

    // Estadísticas de estudiantes
    this.studentService.getStudents().subscribe(students => {
      this.stats.totalStudents = students.length;
    });
  }

  loadSurveyResponseData() {
    this.surveyService.getSurveys().subscribe(surveys => {
      const labels: string[] = [];
      const data: number[] = [];

      surveys.forEach(survey => {
        labels.push(survey.titulo.length > 30 ? survey.titulo.substring(0, 30) + '...' : survey.titulo);

        // Contar respuestas para esta encuesta
        this.surveyService.getSurveyResponses(survey.id).subscribe(responses => {
          const responseCount = responses.length;
          data.push(responseCount);

          // Actualizar gráfico cuando tengamos todos los datos
          if (data.length === surveys.length) {
            this.surveyResponseChartData = {
              ...this.surveyResponseChartData,
              labels: labels,
              datasets: [{
                ...this.surveyResponseChartData.datasets[0],
                data: data
              }]
            };
          }
        });
      });
    });
  }

  loadWorkshopEnrollmentData() {
    this.workshopService.getWorkshops().subscribe(workshops => {
      const labels: string[] = [];
      const data: number[] = [];

      workshops.slice(0, 10).forEach(workshop => { // Limitar a 10 talleres para el gráfico
        labels.push(workshop.nombre_taller.nombre.length > 20 ?
                   workshop.nombre_taller.nombre.substring(0, 20) + '...' :
                   workshop.nombre_taller.nombre);

        this.workshopService.getWorkshopEnrollments(workshop.id).subscribe(enrollments => {
          data.push(enrollments.length);

          if (data.length === Math.min(workshops.length, 10)) {
            this.workshopEnrollmentChartData = {
              ...this.workshopEnrollmentChartData,
              labels: labels,
              datasets: [{
                ...this.workshopEnrollmentChartData.datasets[0],
                data: data
              }]
            };
          }
        });
      });
    });
  }

  loadServiceTypeData() {
    // Este sería un cálculo basado en los servicios y sus tipos
    // Por ahora usamos datos de ejemplo
    this.surveyTypeChartData = {
      ...this.surveyTypeChartData,
      datasets: [{
        ...this.surveyTypeChartData.datasets[0],
        data: [45, 25, 30] // Datos de ejemplo
      }]
    };
  }

  loadRecentSurveys() {
    this.surveyService.getSurveys().subscribe(surveys => {
      // Agregar propiedad de respuestas totales a cada encuesta
      const surveysWithResponses = surveys.map(survey => ({
        ...survey,
        total_responses: 0 // Esto se calcularía en una implementación real
      }));

      this.recentSurveys.data = surveysWithResponses.slice(0, 5); // Mostrar las 5 más recientes
    });
  }

  refreshData() {
    this.loadDashboardData();
  }
}
