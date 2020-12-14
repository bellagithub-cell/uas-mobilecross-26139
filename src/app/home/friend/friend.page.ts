import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.page.html',
  styleUrls: ['./friend.page.scss'],
})
export class FriendPage implements OnInit {
  friends :any[] = []; 
  user: any; 
  userEmail: string;
  userId: any; 
  backup: any; 
  // buat nampung data sementara
  temp: any; 
  constructor(
    private userSrv: UserService,
    private authSrv: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingController,

  ) { }
  
  ngOnInit(){}

  ionViewWillEnter() {
    // untuk ambil data user
   this.authSrv.userDetails().subscribe(res => {
    console.log('res : ', res);
    console.log("uid: ", res.uid);
      if(res !== null){
        this.userEmail = res.email;
        this.userId = res.uid; 
      }else {
        this.navCtrl.navigateBack('');
      }
    }, err => {console.log(err);
    });

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
      console.log("this.temp : ", this.temp); 

      // //cari friends nya
     for(let i = 0; i < this.temp.length; i++){
      console.log(this.temp[i].data.id_friends, " banding ", this.userId);
      if(this.temp[i].data.id_friends === this.userId){
        // console.log(this.temp[i].data);
        this.friends.push(this.temp[i].data);
        console.log("data smnt: ", this.friends);
        console.log("i: ", i);
      }
     }
     console.log("data semua : ", this.friends);
    });
     console.log("lat:", this.temp);
     this.friends = [];
  }

  createfriends(){
    this.navCtrl.navigateForward('home/friend/create');
  }

   goToProfil(){
    console.log("user id : ", this.userId);
    let navigationExtras: NavigationExtras = {
      state: {
        key: this.userId
      }
    };
    this.navCtrl.navigateForward('home/profile', navigationExtras);
  }

  //hapus friends
  async presentAlert(friends: any){
    console.log(friends.id);
    // slidingItem.close();
    const alert = await this.alertCtrl.create({
      header: 'Hapus Friends',
      message: 'Apakah yakin ingin menghapus? Jika sudah dihapus, tidak bisa dikembalikan lagi.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          handler: () => this.deleteFriends(friends.id)
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  deleteFriends(str: string){
    console.log("masuk function ");
    console.log(str);
    this.presentLoading().then(() => {
      this.userSrv.deleteFriend(str);
      this.router.navigateByUrl('/home/friend');
      this.userSrv.presentToast();
    });
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Deleting friends...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed');
  }
  
  //search friend
  async filterList(evt) {
    // console.log(evt);
    this.backup = this.friends; 
    // this.foodList = this.foodListBackup;
    const searchTerm = evt.srcElement.value;
    console.log(this.backup);
  
    if (!searchTerm) {
      return;
    }
    
    this.friends = this.friends.filter(currfriend => {
      console.log(currfriend.email);
      console.log("search : ", searchTerm);
      if(currfriend.email && searchTerm){
        console.log("sama dua2nya");
        return (currfriend.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }
}
