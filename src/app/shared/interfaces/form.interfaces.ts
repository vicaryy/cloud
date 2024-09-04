import { FormControl } from "@angular/forms";

export interface LoginForm {
    email: FormControl;
    password: FormControl;
}

export interface RegisterForm extends LoginForm {
    repeatPassword: FormControl;
}
