import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../../../core/services/data/student.service';
import { TeacherService } from '../../../../core/services/data/teacher.service';
import { WorkshopService } from '../../../../core/services/data/workshop.service';
import { ServiceService } from '../../../../core/services/data/service.service';
import { SurveyService } from '../../../../core/services/data/survey.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    RouterModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    students: 0,
    teachers: 0,
    workshops: 0,
    services: 0,
    surveys: 0,
    activeWorkshops: 0
  };

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private workshopService: WorkshopService,
    private serviceService: ServiceService,
    private surveyService: SurveyService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Cargar estadísticas de estudiantes
    this.studentService.getStudents().subscribe({
      next: (students) => this.stats.students = students.length
    });

    // Cargar estadísticas de docentes
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => this.stats.teachers = teachers.length
    });

    // Cargar estadísticas de talleres
    this.workshopService.getWorkshops().subscribe({
      next: (workshops) => {
        this.stats.workshops = workshops.length;
        this.stats.activeWorkshops = workshops.filter(w => w.activo).length;
      }
    });

    // Cargar estadísticas de servicios
    this.serviceService.getServices().subscribe({
      next: (services) => this.stats.services = services.length
    });

    // Cargar estadísticas de encuestas
    this.surveyService.getSurveys().subscribe({
      next: (surveys) => this.stats.surveys = surveys.length
    });
  }

  refreshStats() {
    this.loadStats();
  }
}
