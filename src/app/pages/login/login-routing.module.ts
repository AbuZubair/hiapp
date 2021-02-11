import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../../services/auth-guard/auth-guard.service';

import { LoginPage } from './login.page';
import { OtpPage } from './otp/otp.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: LoginPage,
        canActivate: [AuthGuard]
      },
      {
        path: 'otp',
        component: OtpPage,
        canActivate: [AuthGuard]
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
