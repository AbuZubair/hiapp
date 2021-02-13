import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpParameterCodec  } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SharedService } from '../shared.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url;
  constructor(private http: HttpClient, private sharedService:SharedService) {
 
  }

  pushNotif(data){
    return new Promise((resolve, reject) => {  
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'key='+environment.key });
      let options = { headers: headers };   
      this.http.post(environment.fcmUrl, data, options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  ForkJoin(obj: object) {
    let observableBatch = [];
    let rx = this;
    Object.keys(obj).forEach(function (key) {
   
      let param
      if(Object.keys(obj[key].param).length != 0 && obj[key].param.constructor === Object){
        param = new HttpParams();
        for (var k of Object.keys(obj[key].param)) {
          param = param.append(k, obj[key].param[k]);
        }
      }else{
        param = obj[key].param
      }

      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'key='+environment.key });
      let options = { headers: headers };

      if (obj[key].method == "post") observableBatch.push(rx.http.post(obj[key].url, obj[key].data, options));
      if (obj[key].method == "get") {
        observableBatch.push(rx.http.get(rx.url + obj[key].url,{ params: param }));
      }
    });
    return forkJoin(observableBatch);
  }

}
