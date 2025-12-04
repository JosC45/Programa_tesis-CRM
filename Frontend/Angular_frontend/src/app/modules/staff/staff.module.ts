import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { STAFF_ROUTES } from './staff.routes';
import { StaffLayoutComponent } from './layout/staff-layout/staff-layout.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(STAFF_ROUTES),
    StaffLayoutComponent
  ]
})
export class StaffModule { }
