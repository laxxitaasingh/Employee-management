import { AbstractControl, ValidationErrors } from "@angular/forms";

export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^[0-9]{10}$/; // only 10 digits
    const valid = phoneRegex.test(control.value);
    return valid ? null : { invalidPhone:true };
  }