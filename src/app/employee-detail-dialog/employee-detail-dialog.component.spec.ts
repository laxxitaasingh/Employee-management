import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeDetailDialogComponent } from './employee-detail-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('EmployeeDetailDialogComponent', () => {
  let component: EmployeeDetailDialogComponent;
  let fixture: ComponentFixture<EmployeeDetailDialogComponent>;

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
    await TestBed.configureTestingModule({
      declarations: [EmployeeDetailDialogComponent],
      imports: [
        MatDialogModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { employee: mockEmployee } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive employee data through MAT_DIALOG_DATA', () => {
    expect(component.data.employee).toEqual(mockEmployee);
  });

  it('should display employee details in the template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Employee Details');
    expect(compiled.querySelector('p:nth-child(2)').textContent).toContain(mockEmployee.name);
    expect(compiled.querySelector('p:nth-child(3)').textContent).toContain(mockEmployee.company_name);
    expect(compiled.querySelector('p:nth-child(4)').textContent).toContain(mockEmployee.email);
    expect(compiled.querySelector('p:nth-child(5)').textContent).toContain(mockEmployee.contact_no);
    expect(compiled.querySelector('p:nth-child(6)').textContent).toContain(mockEmployee.designation);
  });

  it('should display employee avatar', () => {
    const compiled = fixture.nativeElement;
    const imgElement = compiled.querySelector('img');
    expect(imgElement).toBeTruthy();
    expect(imgElement.src).toBe(mockEmployee.avatar_url);
    expect(imgElement.width).toBe(80);
    expect(imgElement.height).toBe(80);
    expect(imgElement.style.borderRadius).toBe('50%');
  });

  it('should have a close button', () => {
    const compiled = fixture.nativeElement;
    const closeButton = compiled.querySelector('button');
    expect(closeButton).toBeTruthy();
    expect(closeButton.textContent).toContain('Close');
  });
});