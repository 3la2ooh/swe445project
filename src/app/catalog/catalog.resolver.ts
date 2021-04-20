import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CatalogItem } from '../../classes/catalog-item.model';
import { DataStorageService } from '../shared/data-storage.service';
import { CatalogService } from './catalog.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogResolver implements Resolve<CatalogItem[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private catalogService: CatalogService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): CatalogItem[] | Observable<CatalogItem[]> | Promise<CatalogItem[]> {
    if (this.catalogService.catalogItems.length <= 0) {
      return this.dataStorageService.fetchCatalogProducts();
    } else {
      return this.catalogService.catalogItems;
    }
  }
}
