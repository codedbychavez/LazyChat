import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { PasswordValidatorModel } from "./models/password.validator.model";

export function passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        if(!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);

        const hasLowerCase = /[a-z]+/.test(value);

        const hasNumeric = /[0-9]+/.test(value);

        // let passwordStrength = new PasswordValidatorModel();

        // passwordStrength.hasUpperCase = hasUpperCase;
        // passwordStrength.hasLowerCase = hasLowerCase;
        // passwordStrength.hasNumeric = hasNumeric;

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric

        return !passwordValid ? {passwordStrength:true}: null;
    }
}


function checkMatch(valueA: any, valueB: any) {
    if(valueA != valueB) {
        return false;
    } else {
        return true;
    }
}

export function mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

