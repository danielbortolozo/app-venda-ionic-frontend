import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";


@Injectable()
export class CartService {
    constructor(public storage: StorageService) {
    }

    createOrCleanCart () : Cart {
       let cart : Cart = {itens: []};
       this.storage.setCart(cart);
       return cart;
    }

    getCart() : Cart {
        let cart: Cart = this.storage.getCart();
        if (cart == null) {
            cart = this.createOrCleanCart();
        }
        return cart;
    }

    addProduto(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();        
        let position = cart.itens.findIndex(x => x.produto.id == produto.id);

        if (position == -1) {
            cart.itens.push({quantidade: 1, produto: produto});
        }
        this.storage.setCart(cart);
        return cart;
    }

}
