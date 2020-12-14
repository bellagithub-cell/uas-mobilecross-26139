import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  fname: any; 
  id: any; 
  map: any; 
  temp: any; 
  status: boolean; 
  constructor(
    private userSrv: UserService,
    private authSrv: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router,
  ) { }

  ngOnInit(){
    //ambil data semua friend 
    this.userSrv.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({data: c.payload.doc.data()}))
        )
    ).subscribe(data => {
      console.log(data);
      // this.user = data;
      // console.log(this.user[0].data.fname);
      // console.log(this.user[0].data.poslat);
      this.temp = data; 
      console.log("Length data : " + data.length);
      console.log("id friends " + this.temp[1].data.id_friends);
    });
  }

  ionViewWillEnter() {
    this.authSrv.userDetails().subscribe(res => {
      console.log('res', res);
      // console.log('uid', res.uid);
      if(res !== null){
        // this.userEmail = res.email; 
        this.id = res.uid; 
      } else {
        this.navCtrl.navigateBack('/login');
      }
    },
    err => {
      console.log(err);
    });
  }

 async onSubmit(form: NgForm){
   console.log("temp: ", this.temp);
    console.log(form.value.email);
    this.fname = form.value.fname;

    for(var i = 0; i < this.temp.length; i++){
      console.log("haia");
      if(this.temp[i].data.email === form.value.email){
        console.log("temp: ", this.temp[i].data.email);
        console.log("email: ", form.value.email);
        this.userSrv.addfriend(this.id, this.temp[i].data.id);
        this.status = true; 
        break; 
      }
    }

    // find friends tidak bisa rupanya
    // this.userSrv.findfriend(form).snapshotChanges().pipe(
    //   map(changes => changes.map(c => ({data: c.payload.doc.data()})))
    // ).subscribe(data => {
    //   console.log(data);
    //   if(data != null){
    //     this.temp = data; 
    //     console.log(this.temp);
    //     console.log(this.temp[0].data.email);
    //     console.log(this.temp[0].data.id);
    //     // this.userSrv.addfriend(this.id, this.temp[0].data.id);
    //     // this.navCtrl.navigateBack('home/friends');
    //   } else {

    //   }
    // });
    if(this.status == true){
      this.presentToast("Friend Has Been Added", "success");
    } else {
      this.presentToast("Friend Not Found", "warning");
    }
    
    // this.router.navigate(['/home']);
  }

  async presentToast(toastMessage: string, colorMessage: string) {
    const toast = await this.toastCtrl.create({
      message: toastMessage,
      duration: 3000,
      position: 'bottom',
      color: colorMessage,
    });
    await toast.present();
  }

}
