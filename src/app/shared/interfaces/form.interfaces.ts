import { FormControl } from "@angular/forms";

export interface LoginForm {
    email: FormControl;
    password: FormControl;
}

export interface RegisterForm extends LoginForm {
    confirmPassword: FormControl;
}

export interface VerificationCodeForm {
    inputFirst: FormControl;
    inputSecond: FormControl;
    inputThird: FormControl;
    inputFourth: FormControl;
}

export interface LoginCredentials {
    email: string;
    password: string
}

export interface RegisterCredentials extends LoginCredentials {
}

export interface Verification {
    email: string;
    verificationCode: string;
}
