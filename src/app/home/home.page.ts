import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { LocComponent } from '../component/loc/loc.component';
import { NavigationExtras } from '@angular/router';

declare var google: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: any;
  //buat nampung data user
  user: any; 
  umnPos : any = []; 
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  userEmail: string;
  userId: any; 
  infoWindow: any = new google.maps.InfoWindow();
  // buat nampung data sementara
  temp: any; 
  friends: any = []; // buat nampung semua friends
  friendsData: any; 

  // buat maps
  poslat: any;
  poslng: any;
  marker: any; 


  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private db: AngularFirestore,
    private userSrv: UserService,
    private popover: PopoverController,
  ) {}

  day: string; 
  ionViewWillEnter(){
    // untuk ambil data user
    this.authSrv.userDetails().subscribe(res => {
      console.log('res : ', res);
      console.log("uid: ", res.uid);
      if(res !== null){
        this.userEmail = res.email;
        this.userId = res.uid; 

        // update data user ke loc skrng
        this.UpLoc();

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

          //cari friends nya
          for(let i = 0; i < this.temp.length; i++){
            console.log(this.temp[i]);
            if(this.temp[i].data.id_friends === this.userId || this.temp[i].data.id === this.userId){
              this.friends.push(this.temp[i].data);
              console.log("data smnt: ", this.friends);
            } 
            //ambil data userid
            if(this.temp[i].data.id === this.userId){
              this.user = {
                lat: this.temp[i].data.poslat,
                lng: this.temp[i].data.poslng,
              }
              console.log("data user: ", this.user.poslat);
            }
          }
          console.log("data semua : ", this.friends);
          
          // load data poslat dan lng ke array
          for(var i = 0; i < this.friends.length; i++){
            this.umnPos[i] = {
              lat: this.friends[i].poslat,
              lng: this.friends[i].poslng,
            };
          }
          // this.umnPos = {
          //   lat: this.user[0].data.poslat,
          //   lng: this.user[0].data.poslng,
          // }
          console.log("poslat : " + this.umnPos[0].lat);
          this.showMap(this.umnPos);
        });
      }else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log(err);
    });
    this.friends = [];
  }


  showMap(pos: any){
    console.log(pos);
    console.log(pos[0].lat);
    console.log(this.user.lat);
    // buat center doang
    let location = new google.maps.LatLng(this.user.lat, this.user.lng);
    const options = {
      center: location,
      zoom: 13,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    // the marker
    for(var i = 0; i < pos.length; i++){
      console.log("pos ", i, pos[i].lat);
      console.log("pos lng : ", i, pos[i].lng);
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(pos[i].lat, pos[i].lng),
        map: this.map,
      });
      // console.log("maarker: ", marker);

      google.maps.event.addListener(marker, 'click', (function(marker, i){
        return function(){
          this.infoWindow.setContent(pos[i].lat);
          this.infoWindow.open(map, marker);
        }
      })(marker, i));
    }
    // console.log("pos.lat : ", pos.lat);
    // const marker = new google.maps.Marker({
    //   position: pos[0],
    //   map: this.map,
    // });
  }

  UpLoc(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position: Position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.poslat = pos.lat;
        this.poslng = pos.lng;
        console.log(pos.lat);
        console.log(pos);
        // this.marker = new google.maps.Marker({
        //   position: new google.maps.LatLng(this.poslat, this.poslng),
        //   map: this.map
        // });
        // this.map.setCenter(pos);
        //update loc to database
        this.userSrv.updateloc(this.userId, pos);
      });
   }
  }

  CurrLoc(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position: Position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.poslat = pos.lat;
        this.poslng = pos.lng;
        console.log(pos.lat);
        console.log(pos);
        // this.marker = new google.maps.Marker({
        //   position: new google.maps.LatLng(this.poslat, this.poslng),
        //   map: this.map
        // });
        this.map.setCenter(pos);
        //update loc to database
      });
    }
  }


  //Open modal 
  async open(ev) {
    console.log("com prop: ", this.userId);
    // let listData = [{title:"Edit Profile",id:1},{title:"Settings",id:2}]
    const popover = await this.popover.create({
      component: LocComponent,
      event: ev,
      translucent: true,
      componentProps: {key: this.userId}
    });
    return await popover.present();
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
}

