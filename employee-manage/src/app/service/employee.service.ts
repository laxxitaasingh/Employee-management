import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }
  private localStorageKey = 'employees';

//get list of existing employess from local storage
  getEmployees(): any[] {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }
//save employee in local storage
  saveEmployees(employees: any[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(employees));
  }

  //add employee in local storage
  addEmployee(employee: any): void {
    const employees = this.getEmployees();
    employee.id = Date.now();
    employees.push(employee);
    this.saveEmployees(employees);
  }

  //update the detail of employee
  updateEmployee(id: number, updated: any): void {
    const employees = this.getEmployees().map(emp => (emp.id === id ? updated : emp));
    this.saveEmployees(employees);
  }
  //delete employee
  deleteEmployee(id: number): void {
    const employees = this.getEmployees().filter(emp => emp.id !== id);
    this.saveEmployees(employees);
  }
}
