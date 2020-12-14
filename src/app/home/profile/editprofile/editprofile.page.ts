import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource,FilesystemEncoding } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
const { Camera, Filesystem, Storage } = Plugins;

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  key: string; 
  isDesktop: boolean;
  User :any;
  lname: string; 
  fname: string; email: string;
  foto :any; id: string;
  imageUrl : any;
  object: any; 
  selectedFile: any;
  private fileName: any;
  img1: SafeResourceUrl; 
  @ViewChild('f',null) f:NgForm;
  @ViewChild('filePicker',{static:false}) filePickerRef: ElementRef<HTMLInputElement>;

  constructor(
    private platform: Platform,
    private router: Router,
    private userSrv: UserService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer,
  ) { 
    this.key = this.router.getCurrentNavigation().extras.state.key; 
  }

  ngOnInit() {
    if((this.platform.is('mobile')&& this.platform.is('hybrid'))||this.platform.is('desktop')){
      this.isDesktop = true;
    }
  }

  ionViewWillEnter(){
    console.log("ini key", this.key);
     // untuk ambil data berdasarkan id
     this.userSrv.getUser(this.key).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({data: c.payload.doc.data()}))
        )
    ).subscribe(data => {
      console.log("data : ", data);
      this.User = data;
      // console.log(this.User[0].data.name);
      this.id = this.User[0].data.id;
      console.log(this.id);
      this.fname = this.User[0].data.fname; 
      console.log("fname : ", this.fname);
      this.lname = this.User[0].data.lname; 
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
    // this.imageUrl = this.userSrv.getPhotoprofile(this.key);
    console.log("url",this.imageUrl);
  }

  // kalau sudah submit 
  async onSubmit(form : NgForm){
    const alert = await this.alertCtrl.create({
      header: 'Anda yakin ingin mengubah data diri ?',
      message: '',
      mode: 'ios',
      buttons: [
        { text: 'Batal', role: 'cancel'},
        {
          text: 'Iya',
          handler: async () => {
            if(form.invalid){
              return;
            }
            console.log("form : ", form.value);
            if(this.fileName){
              await this.onUpload();
            }
            await this.userSrv.updateProfile(this.key, form.value);
            this.onFinish();
            const toast = await this.toastCtrl.create({
              message: 'Data diri telah di ubah',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
            this.ionViewWillEnter();
          }}]
    });
    await alert.present();
    console.log('onSubmit');
    console.log(form);
  }

  chooseFile (event) {
    this.selectedFile = event.target.files
  }
  
  onFinish(){
    this.router.navigate(['/profile']);
  }

  async getPicture(type:string){
    if(!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')){
      this.filePickerRef.nativeElement.click();
      return;
    }
    
    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });
    let reader = new FileReader();

    this.object = image.webPath;
    // this.object.src = this.object;
    console.log("object", this.object);
    let blob = await fetch(image.webPath).then(r=>r.blob());
    console.log("blob", blob);
    this.img1 = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    console.log(this.img1);

    this.fileName = blob;
    console.log("fileName", this.fileName);
  }

  onFileChoose(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if(!file.type.match(pattern)){
      console.log('File format not supported');
      return;
    }

    reader.onload = ()=>{
      this.img1 = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  onUpload() {
    console.log(this.fileName + ' is uploaded!');
    this.userSrv.uploadPhotoprofile(this.key, this.fileName);
    // this.imageUrl = this.userSrv.getPhotoprofile(this.key);
    // upload code goes here
  }

}
