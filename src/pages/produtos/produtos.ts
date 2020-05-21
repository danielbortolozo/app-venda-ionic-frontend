import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';


@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

   items : ProdutoDTO[];
   categoria : string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public produtoService: ProdutoService,
              public loadingCtrl: LoadingController) {
  }

  

  ionViewDidLoad() {
    let categoria_id = this.navParams.get("categoria_id");
    let loader = this.presentLoadingDefault();
    this.categoria = this.navParams.get("categoria_desc");
    this.produtoService.findByCategoria(categoria_id)
        .subscribe(response => {
         this.items = response['content'];
         loader.dismiss();
         this.loadImageUrls();
        },
           error => {
             loader.dismiss();
           });    
  }

   loadImageUrls() {
     for (var i=0; i<this.items.length; i++){
       let item = this.items[i];
       this.produtoService.getSmallImageFromBucket(item.id)
           .subscribe(response => {
             item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
           },
             error => {});
     }
   }

   showDetail(produto_id : string, categoria_desc: string) {
     this.navCtrl.push('ProdutoDetailPage', {produto_id: produto_id, categoria_desc: categoria_desc});
   }

   presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Aguarde...',
      duration: 3000
    });
  
    loading.present();
    return loading; 
  }


}
