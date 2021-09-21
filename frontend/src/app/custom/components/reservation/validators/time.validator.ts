import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

// export function pastTimeValidator(): ValidatorFn {
//     return async (control: AbstractControl) : Promise<ValidationErrors | null> => {
//         const value = control.value;
//         if(!value) {
//             return null;
//         }

//         // 06:29

//         let inputTime = value // from time input in html (06:29);
        
//         const splittedInputTime = inputTime.split(':');

//         let currentDate = new Date();
//         currentDate.setHours(splittedInputTime[0]);
//         currentDate.setMinutes(splittedInputTime[1]);

//         const finalInputTime = currentDate.toTimeString().split(" ")[0];
        
//         const currentTime = new Date().toTimeString().split(" ")[0];

//         // Returns a boolean (true/ false)
//         let validTime = finalInputTime >= currentTime;
        

//         return !validTime ? {pastTime:true} : null;
//     }
// }

// Cross validators
export function pastTimeValidator(date: string, time: string) {
    return (formGroup: FormGroup) => {
        const dateControl = formGroup.controls[date];
        const timeControl = formGroup.controls[time];

        if (dateControl.errors && !timeControl.errors?.pastTime) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // clean the raw input (Prevents the one day less issue)
        let cleanedRawDateInput = dateControl.value.replace(/-/, '/').replace(/-/, '/')

        // Get the date control val

        let dateControlValue = new Date(cleanedRawDateInput);
        let today = new Date().toDateString();
        
        let newToday = new Date(today);

        // Check for today

        if(dateControlValue.toDateString() == newToday.toDateString()) {
            const inputTime = timeControl.value;
            if(inputTime) {
                const splittedInputTime = inputTime.split(':');
                const currentDateWithTime = new Date();
                currentDateWithTime.setHours(splittedInputTime[0]);
                currentDateWithTime.setMinutes(splittedInputTime[1]);
    
                const finalInputTime = currentDateWithTime.toTimeString().split(" ")[0];
                const currentTime = new Date().toTimeString().split(" ")[0];
    
                if(new Date ('1/1/1999 ' + finalInputTime) <= new Date ('1/1/1999 ' + currentTime) ) {
                    timeControl.setErrors({'pastTime': true});
                }
            }
        
        } else {
            if(timeControl.hasError('pastTime')) {
                timeControl.setErrors(null);
            }
        }
   
    }
}