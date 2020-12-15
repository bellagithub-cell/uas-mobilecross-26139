import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';

//import component popover
import { PopoverComponent } from '../../component/popover/popover.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  User :any;
  key: string;
  name: string; email: string;
  foto :any; id: string;
  imageUrl : any;
  Check: any; 

  constructor(
    private activatedRoute: ActivatedRoute,
    private userSrv: UserService,
    private router: Router, 
    private popoverController: PopoverController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) { 
    this.key = this.router.getCurrentNavigation().extras.state.key; 
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
       // untuk dapetin id nya
       this.activatedRoute.paramMap.subscribe(paramMap => {
        // if(!paramMap.has('profileId')) { return; }
        
        // const key = paramMap.get('profileId');
        // this.key = key;
        // console.log(key);
        
        console.log("user id : ", this.key);
        // untuk ambil data berdasarkan id
        this.userSrv.getUser(this.key).snapshotChanges().pipe(
          map(changes => 
            changes.map(c => ({data: c.payload.doc.data()}))
            )
        ).subscribe(data => {
          console.log(data);
          this.User = data;
          // console.log(this.User[0].data.name);
          this.id = this.User[0].data.id;
          console.log(this.id);
          this.name = this.User[0].data.fname + " " + this.User[0].data.lname; 
          this.email = this.User[0].data.email;
          // this.birthDate = this.birthDate.toLocaleDateString('en-GB');
          if(this.User[0].data.storageRef != null){
            this.imageUrl = this.User[0].data.storageRef;
            console.log("imageurl : " + this.imageUrl);
          }
          else{
            this.imageUrl = 'assets/image/profile.png';
            console.log("avatar : " + this.imageUrl);
          }
        });
      });

      // untuk ambil data check in user
      this.userSrv.getCheckIn(this.key).snapshotChanges().pipe(
        map(changes => 
          changes.map(c => ({dc: c.payload.doc.data(), idchek: c.payload.doc.id}))
          )
      ).subscribe(dc => {
        console.log("data checkin : ", dc);
        this.Check = dc;
        // console.log(this.Check[0].dc.locname);
        // console.log(this.Check[0].idchek);
      });
      // this.imageUrl = this.userSrv.getPhotoprofile(this.key);
      console.log("url",this.imageUrl);
  }

  async presentPopover(ev) {
    // let listData = [{title:"Edit Profile",id:1},{title:"Settings",id:2}]
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {key:this.key}
    });
    return await popover.present();
  }

  async press(d: any, i: any){
    console.log("event");
    console.log(i);
    console.log(d);
    console.log(d.id);
    console.log(this.Check[i].idchek);
    // slidingItem.close();
    const alert = await this.alertCtrl.create({
      header: 'Hapus History',
      message: 'Apakah yakin ingin menghapus? Jika sudah dihapus, tidak bisa dikembalikan lagi.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          handler: () => this.deleteCheckIn(this.Check[i].idchek)
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  deleteCheckIn(str: string){
    console.log("masuk function ");
    console.log(str);
    this.presentLoading().then(() => {
      this.userSrv.deleteCheckIn(str);
      this.router.navigateByUrl('/home');
      this.userSrv.presentDelete();
    });
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Deleting Check In...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed');
  }

}
