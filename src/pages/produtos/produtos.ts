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

   items : ProdutoDTO[] = [];
   categoria : string;
   page : number = 0;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public produtoService: ProdutoService,
              public loadingCtrl: LoadingController) {
  }

  

  ionViewDidLoad() {
     this.loadData(); 
  }
  loadData(){
    let categoria_id = this.navParams.get("categoria_id");
    let loader = this.presentLoadingDefault();
   // this.categoria = this.navParams.get("categoria_desc");
    this.produtoService.findByCategoria(categoria_id, this.page, 5)
        .subscribe(response => {
          let start = this.items.length;
         this.items = this.items.concat(response['content']);
         let end = this.items.length - 1;
         loader.dismiss();
         console.log(this.page);
         console.log(this.items);
         this.loadImageUrls(start, end);
        },
           error => {
             loader.dismiss();
           });   
  }

   loadImageUrls(start: number, end: number) {
     for (var i=start; i<=end; i++){
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

  doRefresh(event) {
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      
      event.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll){
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

 
  

}
