
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {
  employees: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadEmployees();
  }
  //gets you all the employees
  loadEmployees() {


  }
  //Open dialog to add employees
  openAddDialog() {
   
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
