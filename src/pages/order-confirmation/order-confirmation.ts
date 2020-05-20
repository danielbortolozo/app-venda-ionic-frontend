import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';


@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItens: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public cartService: CartService,
              public clienteService: ClienteService,
              public pedidoService: PedidoService) {


      this.pedido = this.navParams.get('pedido');   
      console.log('numeroparcelar :'+this.pedido.pagamento.numeroDeParcelas);       
  }

  ionViewDidLoad() {
    this.cartItens = this.cartService.getCart().itens;
    this.clienteService.findById(this.pedido.cliente.id)
        .subscribe(response => {
          this.cliente = response as ClienteDTO;
          this.endereco = this.findEndereco(this.pedido.enderecoEntrega.id, response['enderecos']);
        },
        error => { 
          this.navCtrl.setRoot('HomePage');
        });
  }
  total(){
    return this.cartService.total();
  }
  private findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO {
     let position = list.findIndex(x => x.id == id);
     return list[position];
  }
  back() {
    this.navCtrl.setRoot('CartPage');
  }

  checkout(){
    this.pedidoService.insert(this.pedido)
        .subscribe(response => {
            this.cartService.createOrCleanCart();
            console.log(response.headers.get('location'));
        },
        error => {
           if (error.status == 403){
             this.navCtrl.setRoot('HomePage');
           }
        });
  }

}
