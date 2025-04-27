import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeFormDialogComponent } from './employee-form-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../service/employee.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

describe('EmployeeFormDialogComponent', () => {
  let component: EmployeeFormDialogComponent;
  let fixture: ComponentFixture<EmployeeFormDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<EmployeeFormDialogComponent>>;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  const mockEmployee = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    designation: 'Developer',
    company_name: 'Tech Corp',
    contact_no: '1234567890',
    avatar_url: 'https://example.com/avatar.jpg'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['addEmployee', 'updateEmployee']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeFormDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'add' } },
        { provide: EmployeeService, useValue: employeeServiceSpy }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<EmployeeFormDialogComponent>>;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values in add mode', () => {
    expect(component.employeeForm.get('name')?.value).toBe('');
    expect(component.employeeForm.get('email')?.value).toBe('');
    expect(component.employeeForm.get('designation')?.value).toBe('');
    expect(component.employeeForm.get('company_name')?.value).toBe('');
    expect(component.employeeForm.get('contact_no')?.value).toBe('');
  });

  it('should initialize form with employee data in edit mode', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [EmployeeFormDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'edit', employee: mockEmployee } },
        { provide: EmployeeService, useValue: employeeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.employeeForm.get('name')?.value).toBe(mockEmployee.name);
    expect(component.employeeForm.get('email')?.value).toBe(mockEmployee.email);
    expect(component.employeeForm.get('designation')?.value).toBe(mockEmployee.designation);
    expect(component.employeeForm.get('company_name')?.value).toBe(mockEmployee.company_name);
    expect(component.employeeForm.get('contact_no')?.value).toBe(mockEmployee.contact_no);
  });

  it('should call addEmployee and close dialog when submitting in add mode', () => {
    const formValue = {
      name: 'New Employee',
      email: 'new@example.com',
      designation: 'Tester',
      company_name: 'Test Corp',
      contact_no: '9876543210'
    };

    component.employeeForm.patchValue(formValue);
    component.onSubmit();

    expect(employeeService.addEmployee).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should call updateEmployee and close dialog when submitting in edit mode', () => {
    // Create a new dialog reference for this test
    const editDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [EmployeeFormDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: editDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'edit', employee: mockEmployee } },
        { provide: EmployeeService, useValue: employeeService }
      ]
    }).compileComponents();

    // Create new component instance
    const editFixture = TestBed.createComponent(EmployeeFormDialogComponent);
    const editComponent = editFixture.componentInstance;
    editFixture.detectChanges();

    // Wait for the form to be initialized
    editFixture.whenStable().then(() => {
      const updatedValue = {
        name: 'Updated Name',
        email: 'updated@example.com',
        designation: 'Senior Developer',
        company_name: 'Updated Corp',
        contact_no: '1234567890'
      };

      // Update form values
      editComponent.employeeForm.patchValue(updatedValue);
      editFixture.detectChanges();

      // Submit the form
      editComponent.onSubmit();
      editFixture.detectChanges();

      // Verify service call and dialog close
      expect(employeeService.updateEmployee).toHaveBeenCalledWith(mockEmployee.id, updatedValue);
      expect(editDialogRef.close).toHaveBeenCalled();
    });
  });

  it('should close dialog when canceling', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const nameControl = component.employeeForm.get('name');
    const emailControl = component.employeeForm.get('email');
    const designationControl = component.employeeForm.get('designation');
    const companyControl = component.employeeForm.get('company_name');
    const contactControl = component.employeeForm.get('contact_no');

    nameControl?.setValue('');
    emailControl?.setValue('');
    designationControl?.setValue('');
    companyControl?.setValue('');
    contactControl?.setValue('');

    expect(nameControl?.valid).toBeFalsy();
    expect(emailControl?.valid).toBeFalsy();
    expect(designationControl?.valid).toBeFalsy();
    expect(companyControl?.valid).toBeFalsy();
    expect(contactControl?.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.employeeForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should have correct form field labels', () => {
    const compiled = fixture.nativeElement;
    const labels = compiled.querySelectorAll('mat-label');
    expect(labels[0].textContent).toContain('Name');
    expect(labels[1].textContent).toContain('Company Name');
    expect(labels[2].textContent).toContain('Email');
    expect(labels[3].textContent).toContain('Contact No.');
    expect(labels[4].textContent).toContain('Designation');
  });

  it('should have submit and cancel buttons', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Cancel');
    expect(buttons[1].textContent).toContain('Add');
  });

  it('should have correct button text based on mode', () => {
    // Test add mode
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons[1].textContent).toContain('Add');

    // Test edit mode
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [EmployeeFormDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'edit', employee: mockEmployee } },
        { provide: EmployeeService, useValue: employeeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const editModeButtons = fixture.nativeElement.querySelectorAll('button');
    expect(editModeButtons[1].textContent).toContain('Update');
  });
});
