
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

  loadEmployees() {


  }

  openAddDialog() {
   
  }

  openEditDialog(employee: any) {
  
  }

  openDetailDialog(employee: any) {
   
  }

  openDeleteDialog(employee: any) {
   
  }
}
