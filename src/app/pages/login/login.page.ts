import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Router, RouterEvent, NavigationExtras } from '@angular/router';

import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth/auth.service';
import { LoadingService } from '../../services/loading/loading.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  isSubmitted = false; 

  constructor(
    public formBuilder: FormBuilder,
    public authService:AuthService, 
    public sharedService:SharedService, 
    public router: Router, 
    public loading:LoadingService, 
    public toast:ToastService
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    })    
  } 

  get errorControl() {
    return this.loginForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return false;
    } else {
      this.loading.present().then(()=>{
        let check = this.sharedService.normalizeMsisdn(this.loginForm.value.mobile)
        if(check){
          let data = { msisdn: check }
          try {
            this.authService.login(data).then(resp => {
              this.loading.dismiss()
              this.sharedService.setMsisdn(Number(data.msisdn))
              let navigationExtras: NavigationExtras = {
                queryParams: {
                    msisdn: this.loginForm.value.mobile  
                }
              };
              this.router.navigate(['login/otp'],navigationExtras)
            })            
          } catch (error) {
            this.toast.present(error.message)
            this.loading.dismiss()
          }          
        }else{
          this.toast.present('MSISDN is not valid')
          this.loading.dismiss()
        }
      })
    }
  }
 
}
