import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CreateVictimPage } from '../../modal/create-victim/create-victim.page';
import { Storage } from '@ionic/storage';
import { FirebaseService } from '../../services/firebase/firebase.service';

interface Product {
  name: string,  
  description: string,
  quantity: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  masterList: Array<any>;
  victimList: Array<any>;
  editData: {}
  user: any;

  constructor(
    public modalController: ModalController,
    public firebaseService: FirebaseService,
    public toast: ToastService,
    public alertController: AlertController,
    public storage: Storage,
    private authService: AuthService
  ) { 

  }

  ngOnInit() {
    this.authService.userData.subscribe(res => {
      this.user = res      
    })
    this.getData()
    // this.storage.get('user').then((res) => {     
    //   this.user = res
    //   this.getData()
    // })
  }

  getData(){
    this.firebaseService.reads(this.user.msisdn).subscribe(data => {

      this.masterList = data.map(e => {
        return {
          docId: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          age: e.payload.doc.data()['age'],
          address: e.payload.doc.data()['address'],
          photo: e.payload.doc.data()['photo'],
          gender: e.payload.doc.data()['gender'],
          loc: e.payload.doc.data()['loc'],
        };
      })
      this.victimList = this.masterList
    });
  }

  add(){
    this.presentModal()
  }

  delete(data){
    try {
      this.firebaseService.delete(data.docId)
      this.toast.present("Data successfully deleted")
    } catch (error) {
      this.toast.present(error.message)
    }    
  }

  edit(data){
    this.editData = data
    this.presentModal()
  }

  async presentModal() {
    let conf = {
      component: CreateVictimPage      
    }
    if(this.editData)conf['componentProps'] = {
      'data': this.editData,
    }
    const modal = await this.modalController.create(conf);

    modal.onDidDismiss()
      .then((data) => {
       this.editData = {}
    });

    return await modal.present();    
  }

  async presentAlertConfirm(data) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure??',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.delete(data)
          }
        }
      ]
    });

    await alert.present();
  }

  async filterList(evt) {
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      this.getData()
    }
  
    this.victimList = this.masterList.filter(item => {
      return ( (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (item.address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1));
    });
  }

}
