import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user.model';
import firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;

  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFirestore
  ) { 
  this.userCollection = db.collection<User> ('users');
  this.users = this.userCollection.snapshotChanges().pipe(
      map (actions => {
        return actions.map (a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ... data};
        });
      })
  );}

  registerUser(value){
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.createUserWithEmailAndPassword(value.email, value.password)
      .then(
        res => {
          console.log("Masuk register");
          const user: User = {
            id: res.user.uid,
            email: value.email,
            fname: value.fname,
            lname: value.lname,
            poslat: value.poslat,
            poslng: value.poslng,
            id_friends: value.id_friends,
          };
          this.userCollection.doc(res.user.uid).set(user);
          resolve(res);
        },
        err => reject(err)
      );
    });
  }


  // untuk login
  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(value.email, value.password)
          .then(
              res => resolve(res),
              err => reject(err));
    });
  }

  // untuk logout
  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.fireAuth.currentUser) {
        this.fireAuth.signOut()
            .then(() => {
              console.log('Log Out');
              // resolve();
            }).catch((error) => {
          reject();
        });
      }
    });
  }

  userDetails(){
    return this.fireAuth.user; 
  }

  // get curr user
  // getCurrentUser() {
  //   if (firebase.auth().currentUser) {
  //      return firebase.auth().currentUser;
  //   } else {
  //      return null;
  //   }
  // }
}
