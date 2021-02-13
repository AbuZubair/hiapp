import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth/auth.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { ToastService } from '../../services/toast/toast.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-create-victim',
  templateUrl: './create-victim.page.html',
  styleUrls: ['./create-victim.page.scss'],
})
export class CreateVictimPage implements OnInit {

  @Input() data:any
  newForm: FormGroup;
  isSubmitted: boolean = false;
  isEdit: boolean = false;
  title: string = 'Create New Victim'
  loc: string;
  user: any;
  tokens: any;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  UploadedFileURL: Observable<string>;
  images: Observable<MyData[]>; 
  fileName:string;
  fileSize:number;
  filePath:string;

  isUploading:boolean = false;
  isUploaded:boolean = false;

  constructor(
    public sharedService:SharedService,
    public formBuilder: FormBuilder,
    private fireService: FirebaseService,
    public toast:ToastService,
    public modalController: ModalController,
    private httpService: HttpService,
    private fireStorage: AngularFireStorage,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.newForm = this.formBuilder.group({      
      name: ['',[Validators.required]],
      age: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      address: ['',[Validators.required]],
      photo : ['',[Validators.required]],
      gender: ['',[Validators.required]],
      loc: ['',[Validators.required]]
    })
    if(this.data && Object.keys(this.data).length > 0){
      this.isEdit = true
      this.setValue()
    }else{
      this.isEdit = false
      this.title = 'Create New Victim'
      this.getLoc()
    }
  }

  getLoc(){
    this.user = this.authService.getUser()    
    this.newForm.controls['loc'].setValue(this.user.loc)
  }

  setValue(){
    this.title = 'Edit Victims'
    this.filePath = this.data.photo
    this.newForm.controls['photo'].setValue(this.filePath)
    this.newForm.controls['name'].setValue(this.data.name)
    this.newForm.controls['age'].setValue(this.data.age)
    this.newForm.controls['address'].setValue(this.data.address)
    this.newForm.controls['gender'].setValue(this.data.gender)
    this.newForm.controls['loc'].setValue(this.data.loc)
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  uploadFile(event: FileList) {

    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') { 
     this.toast.present('unsupported file type')
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;
    this.fileName = file.name;

    const path = `imageStorage/${new Date().getTime()}_${file.name}`;
    const customMetadata = { app: 'Hi App Demo' };
    const fileRef = this.fireStorage.ref(path);
    this.task = this.fireStorage.upload(path, file, { customMetadata });
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        this.UploadedFileURL = fileRef.getDownloadURL();
        
        this.UploadedFileURL.subscribe(resp=>{
          console.log(resp)
          this.filePath = resp,
          this.newForm.controls['photo'].setValue(this.filePath)
          this.isUploading = false;
          this.isUploaded = true;
          this.toast.present('Image successfully uploaded')
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    )
  }

  get errorControl() {
    return this.newForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.newForm.valid) {
      return false;
    } else {   
      try {  
        let data = this.newForm.value      
        if(!this.isEdit){          
          data.createdDate = this.sharedService.getDate(new Date())
          data.createdBy = this.user.msisdn
          this.fireService.create(data) 
          this.pushNotif(data)
          this.toast.present('Data succesfully saved')
        }else{
          this.fireService.update(this.data.docId,data) 
          this.toast.present('Data succesfully updated')
        }        
        this.dismiss()
      } catch (error) {
        this.toast.present(error.message)
      }
    }
  }

  async pushNotif(data){    
    this.tokens = await this.getTokenFcm()
    let myapi = []
    this.tokens.forEach(element => {
      myapi.push({
        method: "post" , 
        url : environment.fcmUrl , 
        data : {
          "notification":{
            "title": 'New Victims',
            "body": `Location: ${data.loc} | Name: ${data.name} | Age: ${data.age}`,
            "sound":"default",
            "click_action":"FCM_PLUGIN_ACTIVITY",
            "icon":"fcm_push_icon"
          },
          "data":{
            "ID":"10"
          },
            "to":element,
            "priority":"high",
            "restricted_package_name":""
        },
        param: {}
      })
    });

    this.httpService.ForkJoin(myapi)
    .subscribe(data => {
      console.log(data);
    }, (err) => {
      console.log(err)
    });
  }

  getTokenFcm(){
    return new Promise((resolve) => {
      this.authService.getToken().subscribe(data => {       
        let token = data.map(e => {
          if(e.payload.doc.data()['token'])return e.payload.doc.data()['token']
        })      
        resolve(token)
      });   
    })     
  }

}
