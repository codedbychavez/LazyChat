import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LeftNavigationComponent } from './left-navigation/left-navigation.component';



@NgModule({
  declarations: [
    FooterComponent,
    NavigationComponent,
    LeftNavigationComponent
  ],
  imports: [
    CommonModule
  ],

  exports: [
    FooterComponent,
    NavigationComponent,
    LeftNavigationComponent,
  ]
})
export class SharedModule { }
