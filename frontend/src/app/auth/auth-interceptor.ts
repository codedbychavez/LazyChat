import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router ) {}

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem("token");

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + token)
            });

            return next.handle(cloned).pipe(
                catchError((err: HttpErrorResponse) => {
                  if (err.status === 401) {
                    // Handle 401 error
                    localStorage.removeItem('token');
                    localStorage.removeItem('expires_at');
                    this.router.navigate(['auth']);
                  }
                    //   console.log('got a 401')
                    return throwError(err);

                })
            )




        }
        else {
            return next.handle(req)

        }

    }


}