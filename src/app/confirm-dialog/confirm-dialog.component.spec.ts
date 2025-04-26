import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const mockData = {
    message: 'Are you sure you want to delete this item?'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [
        MatButtonModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive message through MAT_DIALOG_DATA', () => {
    expect(component.data.message).toBe(mockData.message);
  });

  it('should display confirmation message in the template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Confirm Delete');
    expect(compiled.querySelector('p').textContent).toContain(mockData.message);
  });

  it('should have cancel and delete buttons', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Cancel');
    expect(buttons[1].textContent).toContain('Delete');
  });

  it('should close dialog with false when cancel button is clicked', () => {
    const compiled = fixture.nativeElement;
    const cancelButton = compiled.querySelector('button:first-child');
    cancelButton?.click();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true when delete button is clicked', () => {
    const compiled = fixture.nativeElement;
    const deleteButton = compiled.querySelector('button:last-child');
    deleteButton?.click();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});