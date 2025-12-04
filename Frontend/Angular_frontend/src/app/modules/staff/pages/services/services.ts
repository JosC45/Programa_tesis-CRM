import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService, Service } from '../../../../core/services/data/service.service';
import { ServiceModalComponent } from '../../../../shared/components/modals/service-modal/service-modal.component';

@Component({
  selector: 'app-services',
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
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services implements OnInit {
  services = new MatTableDataSource<Service>([]);
  displayedColumns: string[] = ['nombre', 'tipo', 'descripcion', 'activo', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private serviceService: ServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  ngAfterViewInit() {
    this.services.paginator = this.paginator;
    this.services.sort = this.sort;
  }

  loadServices() {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services.data = services;
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.snackBar.open('Error al cargar los servicios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  createService() {
    const dialogRef = this.dialog.open(ServiceModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadServices();
      }
    });
  }

  toggleServiceStatus(service: Service) {
    const updatedService = { ...service, activo: !service.activo };
    this.serviceService.updateService(service.id, updatedService).subscribe({
      next: () => {
        this.snackBar.open(`Servicio ${updatedService.activo ? 'activado' : 'desactivado'}`, 'Cerrar', { duration: 3000 });
        this.loadServices();
      },
      error: (error) => {
        console.error('Error actualizando servicio:', error);
        this.snackBar.open('Error al actualizar el servicio', 'Cerrar', { duration: 3000 });
      }
    });
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
