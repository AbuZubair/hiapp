import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CreateVictimPage } from '../../modal/create-victim/create-victim.page';
import { Storage } from '@ionic/storage';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { SharedService } from 'src/app/services/shared.service';
import { ChartService } from 'src/app/services/chart/chart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  loading:boolean = true;
  loadingTop:boolean = true;
  loadingTable:boolean = true;
  masterList: Array<any>;
  data: Array<any>;
  top3: Array<any> = [];
  chartData:any;
  
  constructor(
    public modalController: ModalController,
    public firebaseService: FirebaseService,
    public toast: ToastService,
    public alertController: AlertController,
    public storage: Storage,
    public sharedService: SharedService,
    public chartService: ChartService
  ) { }

  ngOnInit() {
    this.getData()
  }

  getData(){
    this.firebaseService.readAll().subscribe(data => {

      this.masterList = data.map(e => {
        return {
          docId: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          age: e.payload.doc.data()['age'],
          address: e.payload.doc.data()['address'],
          photo: e.payload.doc.data()['photo'],
          gender: e.payload.doc.data()['gender'],
          loc: e.payload.doc.data()['loc'],
          createdDate: new Date(e.payload.doc.data()['createdDate']),
        };
      })

      let group = this.sharedService.groupingByKey(this.masterList,'loc')      
      this.data = this.formattingGroupLoc(group)
      this.getTop3()  
      this.getChartData()          
    });    
    setTimeout(() => {
      this.loadingTable = false
    }, 2000);
    
  }

  formattingGroupLoc(group){
    let res = []
    Object.entries(group).forEach(([key, value], index) => {
      let val : any = value
      res.push({
        loc: key,
        count: val.length,
        data: value
      })
    });
    res = res.sort((a, b) => b.data.createdDate - a.data.createdDate)
    return res
  }

  getTop3(){
    this.top3 = []
    let data =  this.data
    data.sort((a,b) =>  b.count-a.count )
    data.forEach((element,i) => {
      if(i<3)this.top3.push(element)
    });
    this.loadingTop = false
  }

  getChartData(){
    if(this.data.length > 0){     
      this.chartData = undefined
      this.loading = true

      let chart = {
        chart:{
          extendedSeries:[
            {
              extendedGraphs:[],
              name:'Regions'
            }          
          ],
          name:'Victims',
          ylabel:'Count'
        },
        type:'COLUMN'
      }

      let promise = new Promise<void>((resolve) => {
        this.data.forEach((element,i) => {
          let age = [0,0,0,0,0,0]
          element.data.map(e => {
            if(e.age < 20)age[0]=age[0] + 1
            if(20 <= e.age && e.age <= 29)age[1] = age[1] + 1
            if(30 <= e.age && e.age <= 39)age[2] = age[2] + 1
            if(40 <= e.age && e.age <= 49)age[3] = age[3] + 1
            if(50 <= e.age && e.age <= 59)age[4] = age[4] + 1
            if(e.age > 59)age[5] = age[5] + 1
          })   
          chart.chart.extendedSeries[0].extendedGraphs.push(
            {
              name: element.loc.charAt(0).toUpperCase() + element.loc.slice(1),
              xlabel:'Visctims per age',
              xseries: [
                '<20',
                '20-29',
                '30-39',
                '40-49',
                '50-59',
                '>59'
              ],
              y: element.count, //total counts per region
              yseries: [
                {
                  data:age, //count per age,
                  name: element.loc.charAt(0).toUpperCase() + element.loc.slice(1)
                }
              ]
            }
          )
          if(i==this.data.length-1)resolve()
        });
      })
      
      promise.then(() => {
        this.chartData = this.chartService.getChartDrilldown(chart)            
        setTimeout(() => {
          this.loading = false
        }, 100);    
      })
    }else{
      this.chartData = this.chartService.noDataChartDrilldown()
      setTimeout(() => {
        this.loading = false
      }, 500);
    }
    
  }

}
