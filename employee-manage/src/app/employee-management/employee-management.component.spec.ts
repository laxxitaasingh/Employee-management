import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeManagementComponent } from './employee-management.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../service/employee.service';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { of } from 'rxjs';

describe('EmployeeManagementComponent', () => {
  let component: EmployeeManagementComponent;
  let fixture: ComponentFixture<EmployeeManagementComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  const mockEmployees = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      designation: 'Developer',
      company_name: 'Tech Corp',
      contact_no: '1234567890',
      avatar_url: 'https://example.com/avatar1.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      designation: 'Designer',
      company_name: 'Design Inc',
      contact_no: '0987654321',
      avatar_url: 'https://example.com/avatar2.jpg'
    }
  ];

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'deleteEmployee']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeManagementComponent],
      imports: [
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy }
      ]
    }).compileComponents();

    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeManagementComponent);
    component = fixture.componentInstance;
    employeeService.getEmployees.and.returnValue(mockEmployees);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on initialization', () => {
    expect(employeeService.getEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual(mockEmployees);
    expect(component.filteredEmployees).toEqual(mockEmployees);
    expect(component.pagedEmployees.length).toBeLessThanOrEqual(component.pageSize);
  });

  it('should filter employees based on search query', () => {
    component.searchQuery = 'John';
    component.filterEmployees();
    expect(component.filteredEmployees.length).toBe(1);
    expect(component.filteredEmployees[0].name).toBe('John Doe');

    component.searchQuery = 'Designer';
    component.filterEmployees();
    expect(component.filteredEmployees.length).toBe(1);
    expect(component.filteredEmployees[0].designation).toBe('Designer');

    component.searchQuery = '';
    component.filterEmployees();
    expect(component.filteredEmployees).toEqual(mockEmployees);
  });

  it('should handle pagination correctly', () => {
    // Test with more employees to demonstrate pagination
    const manyEmployees = Array(12).fill(null).map((_, i) => ({
      id: i + 1,
      name: `Employee ${i + 1}`,
      email: `emp${i + 1}@example.com`,
      designation: 'Developer',
      company_name: 'Company',
      contact_no: '1234567890',
      avatar_url: 'https://example.com/avatar.jpg'
    }));

    employeeService.getEmployees.and.returnValue(manyEmployees);
    component.loadEmployees();

    expect(component.totalPages).toBe(3); // 12 employees / 5 per page = 3 pages
    expect(component.pagedEmployees.length).toBe(5); // First page should have 5 items

    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.pagedEmployees.length).toBe(5);

    component.nextPage();
    expect(component.currentPage).toBe(3);
    expect(component.pagedEmployees.length).toBe(2); // Last page should have 2 items

    component.prevPage();
    expect(component.currentPage).toBe(2);
  });

  it('should open add employee dialog', () => {
    const dialogRef = { afterClosed: () => of(true) };
    dialog.open.and.returnValue(dialogRef as any);

    component.openAddDialog();

    expect(dialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      {
        data: { mode: 'add' },
        width: '400px'
      }
    );
  });

  it('should open edit employee dialog', () => {
    const dialogRef = { afterClosed: () => of(true) };
    dialog.open.and.returnValue(dialogRef as any);

    component.openEditDialog(mockEmployees[0]);

    expect(dialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      {
        data: { mode: 'edit', employee: mockEmployees[0] },
        width: '400px'
      }
    );
  });

  it('should open detail dialog', () => {
    const dialogRef = { afterClosed: () => of(true) };
    dialog.open.and.returnValue(dialogRef as any);

    component.openDetailDialog(mockEmployees[0]);

    expect(dialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      {
        data: { employee: mockEmployees[0] },
        width: '400px'
      }
    );
  });

  it('should open delete confirmation dialog and delete employee when confirmed', () => {
    const dialogRef = { afterClosed: () => of(true) };
    dialog.open.and.returnValue(dialogRef as any);

    component.openDeleteDialog(mockEmployees[0]);

    expect(dialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      {
        data: { message: `Are you sure you want to delete ${mockEmployees[0].name}?` },
        width: '300px'
      }
    );

    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(mockEmployees[0].id);
    expect(employeeService.getEmployees).toHaveBeenCalled();
  });

  it('should open delete confirmation dialog but not delete employee when not confirmed', () => {
    const dialogRef = { afterClosed: () => of(false) };
    dialog.open.and.returnValue(dialogRef as any);

    component.openDeleteDialog(mockEmployees[0]);

    expect(dialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      {
        data: { message: `Are you sure you want to delete ${mockEmployees[0].name}?` },
        width: '300px'
      }
    );

    expect(employeeService.deleteEmployee).not.toHaveBeenCalled();
  });

  it('should have search input field', () => {
    const compiled = fixture.nativeElement;
    const searchInput = compiled.querySelector('input[matInput]');
    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toContain('Search by name, email, or designation');
  });

  it('should display employee cards', () => {
    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('mat-card');
    expect(cards.length).toBe(component.pagedEmployees.length);
  });

  it('should have pagination controls when there are multiple pages', () => {
    const manyEmployees = Array(12).fill(null).map((_, i) => ({
      id: i + 1,
      name: `Employee ${i + 1}`,
      email: `emp${i + 1}@example.com`,
      designation: 'Developer',
      company_name: 'Company',
      contact_no: '1234567890',
      avatar_url: 'https://example.com/avatar.jpg'
    }));

    employeeService.getEmployees.and.returnValue(manyEmployees);
    component.loadEmployees();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const paginationControls = compiled.querySelector('.pagination-controls');
    expect(paginationControls).toBeTruthy();
  });
});
