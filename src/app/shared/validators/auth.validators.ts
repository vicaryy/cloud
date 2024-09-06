import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmPasswordValidator(password: FormControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value !== password.value)
            return { 'noConfirm': control.value }
        return null;
    }
}

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const p = control.value;
        if (!p) return null;
        if (!hasSpecialChar(p)) return { 'noSpecialChar': p }
        if (!hasUppercase(p)) return { 'noUppercase': p }
        if (!hasLowercase(p)) return { 'noLowercase': p }
        if (!hasNumber(p)) return { 'noNumber': p }
        return null;
    }
}

function hasSpecialChar(val: string) {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharPattern.test(val);
}
function hasUppercase(val: string) {
    const uppercasePattern = /[A-Z]/;
    return uppercasePattern.test(val);
}
function hasLowercase(val: string) {
    const lowercasePattern = /[a-z]/;
    return lowercasePattern.test(val);
}
function hasNumber(val: string) {
    const numberPattern = /\d/;
    return numberPattern.test(val);
}
