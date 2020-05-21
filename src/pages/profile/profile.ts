import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
//import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CameraOptions, Camera } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente : ClienteDTO;
  picture: string;
  cameraOn: boolean = false;
  photo: string = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: StorageService,
              public clienteService : ClienteService,
              public camera: Camera) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      console.log('email :'+localUser.email)
      this.clienteService.findByEmail(localUser.email)
          .subscribe(response => {
          this.cliente = response as ClienteDTO;
          this.getImageIfExists();
          },
             error => {
                if (error.status == 403) {
                  this.navCtrl.setRoot('HomePage');
                }
             });
    }else {
      this.navCtrl.setRoot('HomePage');
    }
  }
   
  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
                       .subscribe(response => {
                        this.cliente.imgUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;                        
                       },
                       error => {});
  }
  getCameraPicture() {
    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    console.log('chequei aqui na imagem >>>>>'); 
    this.camera.getPicture(options).then((imageData) => {
      this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
        console.log('Error camera....')
    });
  }

  takePicture() {
    this.photo = '';
 
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 100,
      targetHeight: 100
    }
 
    this.camera.getPicture(options)
      .then((imageData) => {
        let base64image = 'data:image/jpeg;base64,' + imageData;
        this.picture = base64image;
 
      }, (error) => {
        console.error(error);
      })
      .catch((error) => {
        console.error(error);
      })
  }





}
