import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../app/service/employee.service';
import { phoneNumberValidator } from '../validators/phoneNumber.validator';

@Component({
  selector: 'app-employee-form-dialog',
  templateUrl: './employee-form-dialog.component.html',
  styleUrl: './employee-form-dialog.component.css'
})
export class EmployeeFormDialogComponent {
  employeeForm: FormGroup;
  mode: 'add' | 'edit';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeFormDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;
    //formgroup for data
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      company_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact_no: ['', [Validators.required,phoneNumberValidator]],
      designation: ['', Validators.required],
      avatar_url: ['']
    });

    //check if it is update mode
    if (this.mode === 'edit') {
      this.employeeForm.patchValue(data.employee);
    }
  }

  onSubmit() {
    const formValue = this.employeeForm.value;
    if (this.mode === 'add') {
      // Duplicate check
      const employees = this.employeeService.getEmployees();
      const duplicate = employees.some(emp =>
        emp.name.trim().toLowerCase() === formValue.name.trim().toLowerCase() &&
        emp.email.trim().toLowerCase() === formValue.email.trim().toLowerCase() &&
        emp.designation.trim().toLowerCase() === formValue.designation.trim().toLowerCase()
      );
      if (duplicate) {
        alert('An employee with the same Name, Email, and Designation already exists.');
        return;
      }
      formValue.avatar_url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(7)}`;
      this.employeeService.addEmployee(formValue);
      this.dialogRef.close(); 
    } else {
      this.employeeService.updateEmployee(this.data.employee.id, formValue);
      this.dialogRef.close(); 
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
