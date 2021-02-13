import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Router, RouterEvent } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public idxMenu: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  public dataDate: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  public darkmmode = new BehaviorSubject(false);
  public initApp = new BehaviorSubject(true);

  constructor(
    private platform: Platform, 
    private storage: Storage,
    private firestore: AngularFirestore
    ) { 
    
  }

  getLocation(){
    return this.firestore.collection('Locations').snapshotChanges();
  }

  getMode(){
    return this.darkmmode.value;
  }

  Ucase(name: string) {
    return (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-/g, " ");
  } 

  checkPlatform(){
    return (this.platform.is('ios')) ? 'iOS' : 'Android';
  }

  setMsisdn(data) {
    this.storage.set("msisdn", data);
  }

  normalizeMsisdn(msisdn){
    let normalize = msisdn.substring(0,2)
    
    switch (normalize) {
      case '62':
        msisdn = msisdn
        break;
      case '08':
        msisdn = '62'+ msisdn.substring(1)
        break;
      case '81':
      case '82':
      case '85':
      case '89':
      case '83':
      case '87':
      case '88':
        msisdn = '62'+ msisdn
        break;
      default:
        msisdn = false
        break;
    }

    return msisdn
  }

  getCalenderMonth(m?){
    const month = (m)?m:(new Date()).getMonth()
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const thisMonth = monthNames[month];
    return thisMonth+' '+new Date().getFullYear()
  }

  getDate(date: any) {
    const dateOk = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return dateOk;
  }

  numberChecker(data: any) {
    
    if (isFinite(data) && !isNaN(parseFloat(data))) {
      return true;
    } else {
      return false;
    }
  }

  getYesterday(date){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var oneDayTimeStamp = 1000 * 60 * 60 * 24; // Milliseconds in a day
    var diff = date - oneDayTimeStamp;
    var yesterdayDate = new Date(diff);
    const dateOk = ('0' + yesterdayDate.getDate()).slice(-2) + '-' + monthNames[yesterdayDate.getMonth()] + '-' + yesterdayDate.getFullYear();
    return dateOk;
  }

  formattingDate(date){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const _date = date.split('-')
    let mth = monthNames.indexOf(_date[1]) + 1
    return _date[0]+'-'+('0' + mth).slice(-2) +'-'+_date[2]
  }

  formattingDateRev(date){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const _date = date.split('-')
    let mth = monthNames[_date[1]-1]
    return _date[0]+'-'+ mth +'-'+_date[2]
  }

  getLastMth(date){
    var makeDate = new Date(date);
    makeDate.setMonth(makeDate.getMonth() - 1);
    let dateFormat = this.getDate(makeDate)
    return this.formattingDateRev(dateFormat)
  }

  getLast2Mth(date){
    var makeDate = new Date(date);
    makeDate.setMonth(makeDate.getMonth() - 2);
    let dateFormat = this.getDate(makeDate)
    return this.formattingDateRev(dateFormat)
  }

  percentageToFixed(value: number) {
    return value.toFixed(2);
  }

  removeSpacing(str: string) {
    return str.replace(/\s/g, '');
  }

  getTimezone() {
    return new Date().toString().substring(28, 33);
  }

  groupingByKey(arr,key){
    let group = arr.reduce((r, a) => { 
      r[a[key]] = [...r[a[key]] || [], a];
      return r;
    }, {});

    return group    
  }

}
