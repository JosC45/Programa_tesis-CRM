import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { PsicopedagogiaService, Psicopedagogia } from '../../../../core/services/data/psicopedagogia.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-psicopedagogias',
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
    MatTooltipModule
  ],
  templateUrl: './psicopedagogias.component.html',
  styleUrls: ['./psicopedagogias.component.css']
})
export class PsicopedagogiasComponent implements OnInit {
  psicopedagogias = new MatTableDataSource<Psicopedagogia>([]);
  displayedColumns: string[] = ['fecha', 'hora_inicio', 'hora_fin', 'psicologo', 'estado', 'observaciones'];
  currentStudentId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private psicopedagogiaService: PsicopedagogiaService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getCurrentStudentId();
    this.loadPsicopedagogias();
  }

  ngAfterViewInit() {
    this.psicopedagogias.paginator = this.paginator;
    this.psicopedagogias.sort = this.sort;
  }

  getCurrentStudentId() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.currentStudentId = currentUser.id;
    }
  }

  loadPsicopedagogias() {
    if (!this.currentStudentId) {
      this.snackBar.open('Error: No se pudo identificar al estudiante', 'Cerrar', { duration: 3000 });
      return;
    }

    this.psicopedagogiaService.getStudentPsicopedagogias(this.currentStudentId).subscribe({
      next: (psicopedagogias) => {
        this.psicopedagogias.data = psicopedagogias;
      },
      error: (error) => {
        console.error('Error cargando psicopedagogías:', error);
        this.snackBar.open('Error al cargar las psicopedagogías', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'completada': return 'primary';
      case 'pendiente': return 'warn';
      case 'cancelada': return 'accent';
      default: return 'basic';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'completada': return 'Completada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      default: return estado;
    }
  }
}
