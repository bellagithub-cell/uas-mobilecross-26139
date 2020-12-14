import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
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
          changes.map(c => ({dc: c.payload.doc.data()}))
          )
      ).subscribe(dc => {
        console.log("data checkin : ", dc);
        this.Check = dc;
        console.log(this.Check[0].dc.locname);
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

  press(){
    console.log("event");
  }

}
