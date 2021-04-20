import {Specification} from './catalog-item.model';

export class ShoppingCartItem {
  constructor(readonly id: string,
              readonly name: string,
              readonly specification: Specification,
              readonly price: number,
              readonly imageUrl: string[],
              public quantity: number) {
  }
}
