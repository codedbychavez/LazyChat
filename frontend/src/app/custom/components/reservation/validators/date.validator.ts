import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function pastDateValidator(): ValidatorFn {
    return async (control: AbstractControl) : Promise<ValidationErrors | null> => {
        const value = control.value;
        if(!value) {
            return null;
        }

        let inputDate = new Date(value+'T00:00:00');
        inputDate.setHours(0,0,0,0);
        let currentDate = new Date();
        currentDate.setHours(0,0,0,0);

        // Should return a boolean
        let validDate = inputDate >= currentDate;
        

        return !validDate ? {pastDate:true} : null;
    }
}

// Helper functions