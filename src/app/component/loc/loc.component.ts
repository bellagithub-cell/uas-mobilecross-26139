import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

declare var google: any;
@Component({
  selector: 'app-loc',
  templateUrl: './loc.component.html',
  styleUrls: ['./loc.component.scss'],
})

export class LocComponent implements OnInit {
  poslat: any; 
  poslng: any; 
  marker: any; 
  map: any; 
  locname: any; 
  @Input() key; 
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  infoWindow: any = new google.maps.InfoWindow();


  constructor(
    private userSrv: UserService,
    private popoverCtrl: PopoverController,
  ) { }

  ngOnInit() {
    console.log(this.key);
    // this.CurrLoc();
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
        console.log("loc: ", pos);
        this.locname = (document.getElementById("locname") as HTMLInputElement).value;
        console.log(this.locname);
        // this.map.setCenter(pos);

        //update tabel checkin 
        var today = new Date();
        var datenow = String(today.getDate()).padStart(2, '0') + "-" + (today.getMonth()+1) + "-" + today.getFullYear() + " " + String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0');
        console.log(datenow);
        this.userSrv.createcheckin(this.key, datenow, this.locname, pos);

        //update loc to database
        this.userSrv.updateloc(this.key, pos);
        this.popoverCtrl.dismiss();
      });
    }
  }



}
