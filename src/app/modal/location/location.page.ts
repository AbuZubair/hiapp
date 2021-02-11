import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  @Input() data: any;
  @Input() docId: any;
  locForm: FormGroup;
  isSubmitted = false; 
  locationList : any

  constructor(
    public sharedService:SharedService,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    public toast:ToastService,
    public modalController: ModalController,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.locForm = this.formBuilder.group({
      loc: ['', [Validators.required]],
    })

    this.getLocations()
  }

  getLocations(){
    this.sharedService.getLocation().subscribe(data => {
      this.locationList = data.map(e => {
        return {
          id: e.payload.doc.data()['id'],
          name: e.payload.doc.data()['name'],
        };
      })  
    });
  }

  get errorControl() {
    return this.locForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.locForm.valid) {
      return false;
    } else {   
      try {        
        this.data['loc'] = this.locForm.value.loc
        this.authService.updateUser(this.docId,this.data) 
        this.setValue(this.data)
        this.dismiss()
      } catch (error) {
        this.toast.present(error.message)
      }
    }
  }

  setValue(data){
    this.storage.set('login', true);
    this.storage.set('user', data);
    this.authService.user.next(data)
    this.authService.authenticationState.next(true);
  }

  dismiss() {
    this.modalController.dismiss({
      'done': true
    });
  }

}
