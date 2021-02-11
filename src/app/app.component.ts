import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { BackButtonEvent } from '@ionic/core';

import { IonRouterOutlet,Platform, AlertController, NavController, MenuController, ToastController, LoadingController  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { SharedService } from './services/shared.service';
import { ToastService } from './services/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex = 0;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  backButtonSubscription;
  @ViewChild(IonRouterOutlet,{static: false}) routerOutlet: QueryList<IonRouterOutlet>
  loading

  url
  title
  menus
  profile
  open;
  
  togle;
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,

    private router: Router,
    private sharedService: SharedService,
    private authService: AuthService,
    private storage: Storage,
    private toastCtrl: ToastController,
    public toast:ToastService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkUser();
      // this.storage.get('darkmode').then((state) => {
      //   // const toggle:any = document.querySelector('#themeToggle');
      //   this.togle = state
      //   document.body.classList.toggle('dark', state);
        
      //   // toggle.checked = true
      //   if(state){
      //     this.sharedService.darkmmode.next(true)
      //   }else{
      //     this.sharedService.darkmmode.next(false)
      //   }
      // }) 

      setTimeout(() => {
        this.sharedService.initApp.next(false)
      }, 5000);

      document.addEventListener('ionBackButton', (ev: BackButtonEvent) => {
        ev.detail.register(-1, () => {
          const path = window.location.pathname;
          if (path === '/tabs' || path === '/login') {
            if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
              navigator['app'].exitApp();
            } else {
              this.presentToast()
              this.lastTimeBackPress = new Date().getTime();
            }
          }
        });
      });

      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);
    });
  }

  checkUser() {
    this.storage.get('login').then((state) => {
      this.authService.authenticationState.next(state)
      if (!state) {
        this.router.navigate(['login']);
      }else{
        this.storage.get('user').then((user) => {
          this.authService.user.next(user)
          if(user.role == 'admin')this.router.navigate(['dashboard'])
          else this.router.navigate(['home']);
        })
      }
    })
  }

  getProfile(){
    // this.profile = this.authService.generateToken()
  }

  logout(){
    this.storage.clear();
    this.storage.set('login', false);
    this.authService.authenticationState.next(false)
    this.router.navigate(['login']);
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Press again to exit.',
      duration: 2000
    });
    toast.present();
  }

}
