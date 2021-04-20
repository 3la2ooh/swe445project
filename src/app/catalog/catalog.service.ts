import {Injectable} from '@angular/core';

import {CatalogItem, OS} from '../../classes/catalog-item.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private products: CatalogItem[] = [
    // new CatalogItem(
    //   'Apple iPhone 4',
    //   400,
    //   ['assets/img/tech/image2.jpg'],
    //   4.5,
    //   'An old iphone that was once great',
    //   {display: 5.2, camera: 12, os: OS.iOS, ram: 4},
    //   ''
    // ),
    // new CatalogItem(
    //   'Samsung Galaxy Fold',
    //   2093,
    //   ['https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-fold.jpg'],
    //   2.5,
    //   'A foldable phone that is too expensive',
    //   {display: 7.3, camera: 16, os: OS.Android, ram: 12},
    //   ''
    // ),
    // new CatalogItem(
    //   'Sony Xperia Pro',
    //   745,
    //   ['https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-pro-5g.jpg'],
    //   3.5,
    //   'A sony phone',
    //   {display: 6.5, camera: 12, os: OS.Android, ram: 12},
    //   ''
    // ),
    // new CatalogItem(
    //   'Nokia Lumia 1020',
    //   470,
    //   ['https://fdn2.gsmarena.com/vv/bigpic/nokia-lumia-1020-ofic.jpg'],
    //   5,
    //   'The best phone that was ever made',
    //   {display: 4.5, camera: 41, os: OS.WindowsPhone, ram: 2},
    //   ''
    // ),
    // new CatalogItem(
    //   'Huawei Matebook X Pro',
    //   2153,
    //   ['https://www.notebookcheck.net/fileadmin/_processed_/b/d/csm_MG_2597_4ab93c38dd.jpg'],
    //   5,
    //   'The best laptop that was ever made',
    //   {display: 13.9, camera: 5, os: OS.Windows, ram: 8},
    //   ''
    // ),
    // new CatalogItem(
    //   'Apple iPhone 4',
    //   400,
    //   ['assets/img/tech/image2.jpg'],
    //   4.5,
    //   'An old iphone that was once great',
    //   {display: 5.2, camera: 12, os: OS.iOS, ram: 4},
    //   ''
    // ),
    // new CatalogItem(
    //   'Samsung Galaxy Fold',
    //   2093,
    //   ['https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-fold.jpg'],
    //   2.5,
    //   'A foldable phone that is too expensive',
    //   {display: 7.3, camera: 16, os: OS.Android, ram: 12},
    //   ''
    // ),
  ];

  public get catalogItems(): CatalogItem[] {
    return this.products.slice();
  }

  public getItem(id: string): CatalogItem {
    return this.products.find((item) => item.id === id);
  }

  public updateCatalogItems(catalogItems: CatalogItem[]): void {
    this.products = catalogItems;
    // this.productsChanged.next(this.products.slice());
  }
}
