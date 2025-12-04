import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workshops-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './workshops-list.component.html',
  styleUrls: ['./workshops-list.component.css']
})
export class WorkshopsListComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.snackBar.open('Vista de administración de talleres en desarrollo', 'Cerrar', { duration: 3000 });
  }
}
