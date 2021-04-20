import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { CatalogItem } from 'src/classes/catalog-item.model';

@Injectable({
  providedIn: 'root',
})
export class ProductResolver implements Resolve<CatalogItem> {
  constructor(private dataStorageService: DataStorageService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): CatalogItem | Observable<CatalogItem> | Promise<CatalogItem> {
    return this.dataStorageService.fetchCatalogItem(route.params.id);
  }
}
