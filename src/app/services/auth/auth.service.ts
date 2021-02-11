import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SharedService } from '../shared.service';

import { AngularFirestore } from '@angular/fire/firestore';
import { first, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authenticationState = new BehaviorSubject(false);
  isLoggedIn: BehaviorSubject<any> = new BehaviorSubject<any>(false)
  user: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  collectionName = 'Users';

  constructor(
    private storage: Storage, 
    private firestore: AngularFirestore,
    private platform: Platform,
    private sharedService: SharedService
    ) { 
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  async login(cred){
    try {
      let check: any = await this.checkUser(cred.msisdn)
      if(!check){
        this.createUser(cred)                
      }else{
        let data = check[0].payload.doc.data()
        data['otp'] = this.generateOTP()
        data['isValid'] = false
        this.updateUser(check[0].payload.doc.id,data) 
      }      
    } catch (error) {
      console.log(error)      
    }       
  }

  checkUser(msisdn){
    return new Promise((resolve,reject) => {
      this.firestore.collection(this.collectionName, ref => ref.where('msisdn', "==", msisdn)).snapshotChanges()
      .subscribe(res => {
        if (res.length > 0)
        {
          resolve(res);
        }else{
          resolve(false)
        }         
      },err => {
        reject(err)
      });
    })    
  }

  createUser(record) {
    record.otp = this.generateOTP()
    record.isValid = false
    record.role = 'user'
    return this.firestore.collection(this.collectionName).add(record);
  }

  updateUser(recordID, record) {
    this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  }

  generateOTP()
  {
      let digits = '0123456789';
      let otpLength = 4;
      let otp = '';
      for(let i=1; i<=otpLength; i++)
      {
        const index = Math.floor(Math.random()*(digits.length));
        otp = otp + digits[index];
      }
      return otp;
  }

  ifLoggedIn() {
    this.storage.get('login').then((val) => {
      if(val){
        this.getInitData()
      }
    })
  }

  async getInitData(){
         
    await this.storage.get('darkmode').then((val) => {
      if(val){
        this.sharedService.darkmmode.next(true)
      }else{
        this.sharedService.darkmmode.next(false)
      }
    })
  }

  getUser() {
    return this.user.value
  }


}
