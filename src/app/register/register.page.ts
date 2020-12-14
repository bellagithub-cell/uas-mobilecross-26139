import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  regisForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  poslat: any; 
  poslng: any; 

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    confirmpassword: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };
  
  constructor(
      private navCtrl: NavController,
      private authService: AuthService,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.CurrLoc();
    this.regisForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      fname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      lname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      confirmpassword: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      id_friends: new FormControl('', Validators.compose([])),
      poslat: new FormControl('', Validators.compose([])),
      poslng: new FormControl('', Validators.compose([]))
    }, {
      validators: this.matchingpass('password', 'confirmpassword')
    });
  }

  matchingpass(pass: string, confirm: string){
    return (group: FormGroup): {[key: string]: any} => {
      let passwordpass = group.controls[pass];
      let confirmpass = group.controls[confirm];

      if(passwordpass.value !== confirmpass.value){
        return {
          confirmpassword: true
        };
      }
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
      });
    }
  }

  tryRegister(value){
    // this.CurrLoc(); 
    console.log(value);
    value.poslat = this.poslat;
    value.poslng = this.poslng; 
    console.log(value.poslat);
    this.authService.registerUser(value)
    .then(res => {
      console.log(res);
      this.authService.loginUser(value).then(() => {
        this.navCtrl.navigateForward('/home');
      });
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = '';
    });
  }

  goLoginPage(){
    this.navCtrl.navigateBack('/login');
  }


}
