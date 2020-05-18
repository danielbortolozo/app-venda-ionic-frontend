import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = [{
       id: "1",
       logradouro: "Rua rio grande do sul",
       numero: "300",
       complemento: "Apto-12",
       bairro: "Santa monica",
       cep: "15600000",
       cidade : {
         id: "1",
         nome: "uberlandia",
         estado: {
           id: "1",
           nome: "minas gerais"
         }
       }
    },
    {
      id: "2",
      logradouro: "Rua Bahia",
      numero: "40",
      complemento: "casa",
      bairro: "Centro",
      cep: "15600000",
      cidade : {
        id: "1",
        nome: "fernandopolis",
        estado: {
          id: "2",
          nome: "sao paulo"
        }
      }
    }
  ];
  }

}
