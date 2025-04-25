
import { Component, OnInit } from '@angular/core';
import { EmployeeFormDialogComponent } from '../employee-form-dialog/employee-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {
  employees: any[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEmployees();
  }
  //gets you all the employees
  loadEmployees() {


  }
  //Open dialog to add employees
  openAddDialog() {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      data: { mode: 'add' },
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(() => this.loadEmployees());
  }
 //Open dialog to edit employees
  openEditDialog(employee: any) {
  
  }
 //Open dialog to view employees details
  openDetailDialog(employee: any) {
   
  }
 //Open dialog to delete employees
  openDeleteDialog(employee: any) {
   
  }
}
