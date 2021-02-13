import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  collectionName = 'Victims';

  constructor(
    private firestore: AngularFirestore
  ) { }

  create(record) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  reads(msisdn) {
    return this.firestore.collection(this.collectionName, ref => ref.where('createdBy', "==", msisdn).orderBy('createdDate','desc')).snapshotChanges();
  }

  readAll() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  update(recordID, record) {
    this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  }

  delete(recordID) {
    this.firestore.doc(this.collectionName + '/' + recordID).delete();
  }
}