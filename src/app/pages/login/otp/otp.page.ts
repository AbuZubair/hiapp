import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from '../../../services/auth/auth.service';
import { SharedService } from '../../../services/shared.service';
import { LoadingService } from '../../../services/loading/loading.service';
import { ToastService } from '../../../services/toast/toast.service';

import { ModalController } from '@ionic/angular';
import { LocationPage } from '../../../modal/location/location.page';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {

  user : any;
  msisdn : string;
  isSubmitted = false;

  otp : string;
  resOtp: string;
  config = {}

  runTimer : boolean;
  timeInSeconds: number;
  time : number;
  hasStarted : boolean;
  hasFinished : boolean;
  remainingTime : number;
  displayTime : string;
  disable : boolean = true

  constructor(
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private sharedService:SharedService, 
    private authService: AuthService,
    public router: Router, 
    public loading:LoadingService, 
    public toast:ToastService,
    private storage: Storage,
    public modalController: ModalController
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params){
        this.msisdn = this.sharedService.normalizeMsisdn(params.msisdn)
      }
    });
   }

  ngOnInit() {
    this.config = {
      allowNumbersOnly: true,
      length: 4,
      inputStyles: {
        'width': '60px',
        'height': '60px',
        'font-size': '20px',
        'background-color': '#fff'
      }
    };
    this.initTimer();
    this.startTimer();    
  }

  getOtp(){
    this.authService.checkUser(this.msisdn)
    .then(res => {      
      if (res)
      {
        this.user = res
        this.resOtp = res[0].payload.doc.data()['otp']
      }        
    },err => {
      console.log(err)
      this.toast.present(err.message)
    });
  }

  initTimer() {
    if (!this.timeInSeconds) { 
      this.timeInSeconds = 20; 
    }
  
    this.time = this.timeInSeconds;
    this.runTimer = false;
    this.hasStarted = false;
    this.hasFinished = false;
    this.remainingTime = this.timeInSeconds;
    
    this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
  }  
 
  startTimer() {
    this.runTimer = true;
    this.hasStarted = true;
    this.timerTick();
    this.getOtp();
  }

  timerTick() {
    setTimeout(() => {
  
      if (!this.runTimer) { return; }
      this.remainingTime--;
      this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
      if (this.remainingTime > 0) {
        this.timerTick();
      }else {        
        this.hasFinished = true;
      }
    }, 1000);
  }
 
  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return minutesString + ':' + secondsString;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.otp.length < 4) {
      this.toast.present("Please input valid otp")
      return false;
    } else {
      this.loading.present();     
      try {        
        let data = this.user[0].payload.doc.data()
        data['isValid'] = true
        setTimeout(() => {
          this.loading.dismiss();
        }, 100);   
        if(this.otp == data['otp']){
          this.authService.updateUser(this.user[0].payload.doc.id,data) 
                    
          this.redirect(data);
        }else{          
          this.toast.present('OTP is wrong')                 
        }                        
      } catch (error) {
        this.toast.present(error.message)
        this.loading.dismiss();
      }
      

    }
  }

  redirect(data){
    if(data['role'] == 'user'){
      if(!data['loc']){
        this.presentModal(data)
      }else{
        this.setValue(data)
        this.router.navigate(['/']);
      }
    }else{
      this.setValue(data)
      this.router.navigate(['/dashboard']);
    }
  }

  setValue(data){
    this.storage.set('login', true);
    this.storage.set('user', data);
    this.authService.user.next(data)
    this.authService.authenticationState.next(true);
  }

  async presentModal(data) {
    const modal = await this.modalController.create({
      component: LocationPage,
      componentProps: {
        'data': data,
        'docId': this.user[0].payload.doc.id
      }
    });

    modal.onDidDismiss()
      .then((data) => {
       if(data.data.done)this.router.navigate(['/']);
    });

    return await modal.present();    
  }

  onOtpChange(e){
    this.otp = e
    if(this.otp.length>=4)this.disable = false
      else this.disable = true;
  }

}
