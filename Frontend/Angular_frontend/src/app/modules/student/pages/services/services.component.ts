import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ServiceService, Service } from '../../../../core/services/data/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatChipsModule
  ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];

  constructor(
    private serviceService: ServiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getActiveServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.snackBar.open('Error al cargar los servicios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  viewServiceDetails(service: Service) {
    // TODO: Implementar vista de detalles con modal o navegación
    this.snackBar.open(`Detalles del servicio: ${service.nombre}`, 'Cerrar', { duration: 3000 });
  }

  getServiceTypeColor(tipo: string): string {
    switch (tipo) {
      case 'taller': return 'primary';
      case 'psicopedagogia': return 'accent';
      case 'otro': return 'basic';
      default: return 'basic';
    }
  }

  getServiceTypeLabel(tipo: string): string {
    switch (tipo) {
      case 'taller': return 'Taller';
      case 'psicopedagogia': return 'Psicopedagogía';
      case 'otro': return 'Otro';
      default: return tipo;
    }
  }
}
