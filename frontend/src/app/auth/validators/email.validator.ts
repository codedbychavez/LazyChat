import { HttpErrorResponse } from "@angular/common/http";
import { AbstractControl, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

import { InjectorInstance } from "../auth.module";
import { take } from "rxjs/operators";


let emailCheckApiResp: boolean;

export function emailExistValidator(): ValidatorFn {
    return async (control: AbstractControl) : Promise<ValidationErrors | null> => {
        const value = control.value;
        if(!value) {
            return null;
        }

        // Validate validate at endpoint
    
        let emailTaken = emailExist(value).subscribe(
            (result) => {
               
            }
        )

        return !emailTaken ? {emailTaken:true} : null;
    }
}





// Helper functions

async function updateVar(result: any) {
    emailCheckApiResp = result;
}

function getVariable() {
    return emailCheckApiResp;
}


// function checkEmailAgainstAPI(email: string,) {
    
//     emailExist(email).subscribe(
//         (emailExistResponse) => {
//             console.log(emailExistResponse)
//             if(emailExistResponse === true) {
//                 emailCheckApiResp = true;
//                 return true;
//             } else {
//                 console.log('it is false');
//                 emailCheckApiResp = false;
//                 return false;
//             }
            
//         },
//         (err: HttpErrorResponse) => {
//             console.log(err);
//             return false;
//         }
//     )
    
// }


function emailExist(email: string) {

    const httpClient =  InjectorInstance.get<HttpClient>(HttpClient);
    const baseUrl = environment.restApi.uri;

    let formData = new FormData();
    formData.append('email', email);

    return httpClient.post(
      baseUrl + '/validator/email', formData,
    )
  }