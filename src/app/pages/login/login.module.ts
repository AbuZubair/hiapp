import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgOtpInputModule } from  'ng-otp-input';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { OtpPage } from './otp/otp.page';
import { LocationPage } from '../../modal/location/location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgOtpInputModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage,OtpPage,LocationPage]
})
export class LoginPageModule {}
