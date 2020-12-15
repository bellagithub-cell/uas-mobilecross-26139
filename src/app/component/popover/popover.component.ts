import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NavParams, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  key: any; 

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
  ) { 
    this.key = this.navParams.get('key');
  }

  ngOnInit() {
    console.log("this key: ", this.key);
  }

  logOut(){
    this.authSrv.logoutUser()
        .then(res => {
          console.log(res);
          this.router.navigate(['/login']);
        }, err => {
          console.dir(err);
        });
    this.popoverCtrl.dismiss();
  }

  btnEditProfile(){
    let navigationExtra : NavigationExtras = {state:{ key:this.key }}
    this.router.navigate(['home/profile/editprofile'],navigationExtra);
    this.popoverCtrl.dismiss();
  }

}
