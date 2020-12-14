import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
userEmail: string;
userId: string; 
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        console.log(res.uid);
        this.userEmail = res.email;
        this.userId = res.uid;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });
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
