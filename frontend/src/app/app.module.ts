import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CustomModule } from './custom/custom.module';
import { Routes,  RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from "@auth0/angular-jwt";
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth-interceptor';


const routes: Routes = [
  {
    path: '',
    loadChildren: './custom/custom.module#CustomModule',
  },
  {
    path: 'home',
    loadChildren: './custom/custom.module#CustomModule',
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CustomModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    
  ],
  providers: [AuthService,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
