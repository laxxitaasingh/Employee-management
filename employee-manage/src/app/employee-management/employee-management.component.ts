import { Component, OnInit } from '@angular/core';
import { EmployeeFormDialogComponent } from '../employee-form-dialog/employee-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDetailDialogComponent } from '../employee-detail-dialog/employee-detail-dialog.component';
import { EmployeeService } from '../service/employee.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {
  employees: any[] = [];
  pagedEmployees: any[] = [];
  filteredEmployees: any[] = [];
  searchQuery: string = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;


  constructor(private dialog: MatDialog,private employeeService: EmployeeService,) {}

  ngOnInit(): void {
    this.loadEmployees();
  }
  //gets you all the employees
  // loadEmployees() {

  //   this.employees = this.employeeService.getEmployees();
  // }

  loadEmployees(): void {
    this.employees = this.employeeService.getEmployees();
    this.filteredEmployees = [...this.employees];
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    this.setPagedEmployees();
  }

  filterEmployees(): void {
    if (!this.searchQuery) {
      this.filteredEmployees = [...this.employees];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredEmployees = this.employees.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.designation.toLowerCase().includes(query)
      );
    }
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    this.setPagedEmployees();
  }

  setPagedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPagedEmployees();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPagedEmployees();
    }
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
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      data: { mode: 'edit', employee },
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(() => this.loadEmployees());
  }
 //Open dialog to view employees details
  openDetailDialog(employee: any) {
    this.dialog.open(EmployeeDetailDialogComponent, {
      data: { employee },
      width: '400px'
    });
  }
 //Open dialog to delete employees
  openDeleteDialog(employee: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to delete ${employee.name}?` },
      width: '300px'
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.employeeService.deleteEmployee(employee.id);
        this.loadEmployees();
      }
    });
  }
}
