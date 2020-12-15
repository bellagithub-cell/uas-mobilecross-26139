import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbPath = 'users';
  userRef: AngularFirestoreCollection<User>; 
  private storageRef : any;
  private dbCheckin = 'checkin';
  checkinRef: AngularFirestoreCollection<any>;
  
  constructor(
    private db: AngularFirestore,
    private fireStorage : AngularFireStorage,
    private toastController: ToastController,
  ) { this.storageRef = this.fireStorage.ref('Users');}

  //get user berdasarkan id untuk profile
  getUser(idu: string): AngularFirestoreCollection<User>{
    this.userRef = this.db.collection<User>(this.dbPath, ref => ref.where("id", '==', idu));
    console.log(this.userRef);
    return this.userRef;
  }

  // ambil semua data lokasinya 
  getAll(): AngularFirestoreCollection<User>{
    this.userRef = this.db.collection<User>(this.dbPath);
    console.log(this.userRef);
    return this.userRef;
  }

  getCheckIn(idu: string): AngularFirestoreCollection<any>{
    this.checkinRef = this.db.collection<any>(this.dbCheckin, ref => ref.where("id_user", '==', idu).orderBy("tanggal", 'desc'));
    console.log(this.checkinRef);
    return this.checkinRef;
  }

  //update profile
  updateProfile(idu: string, value: any){
    console.log("value form: ", value.fname);
    this.db.doc(this.dbPath + '/' + idu).update({fname: value.fname});
    this.db.doc(this.dbPath + '/' + idu).update({lname: value.lname});
    this.db.doc(this.dbPath + '/' + idu).update({email: value.email});
  }

  uploadPhotoprofile(id, foto){
    let ref = this.fireStorage.ref('Users/'+id+'/'+"profile");
      // this.storageRef.child(id).put(foto[0])
    ref.put(foto).then(res=>{
      ref.getDownloadURL().subscribe(url=>{
        console.log(url);
        this.db.doc(this.dbPath+ '/' + id).update({storageRef:url});
      });

    }).catch(e=>{
      console.log(e);
    });
  }

  updateloc(id, pos){
    console.log(pos.lat);
    console.log(pos.lng);
    this.db.doc(this.dbPath + '/' + id).update({poslat: pos.lat, poslng: pos.lng});
  }

  createcheckin(id, tanggal, locname, pos) {
    console.log(tanggal);
    console.log(id);
    console.log(locname);
    const check: any = {
      id_user: id,
      tanggal: tanggal,
      locname: locname,
      poslat: pos.lat,
      poslng: pos.lng
    };
    // private userCollection: AngularFirestoreCollection<any>;
    // this.userCollection = db.collection<User> ('users');
    this.db.collection<any>('checkin').doc().set(check);
  }

  findfriend(form){
    console.log(form.value.email);
    this.userRef = this.db.collection<any>(this.dbPath, ref => ref.where("email", '==', form.value.email));
    return this.userRef;
  }

  addfriend(idu, idfriend){
    // console.log(email);
    this.db.doc(this.dbPath + '/' + idfriend).update({id_friends: idu});
  }

  // function untuk delete teman
  deleteFriend(idfriend: string){
    console.log("friend masuk ke appservice" + idfriend);
    this.db.doc(this.dbPath + '/' + idfriend).update({id_friends: null});
    // this.storage = this.storage.filter(str => {
    //   return str.id !== storageId;
    // });
  }

  deleteCheckIn(idcheck: string){
    console.log("check masuk ke appservice" + idcheck);
    this.db.doc(this.dbCheckin + '/' + idcheck).delete();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Friend Has Been Deleted',
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    toast.present();
  }

  async presentDelete() {
    const toast = await this.toastController.create({
      message: 'Check In Has Been Deleted',
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    toast.present();
  }

  

}
