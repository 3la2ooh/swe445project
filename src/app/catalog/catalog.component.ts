import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogItem } from '../../classes/catalog-item.model';
import { CatalogService } from './catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: CatalogItem[] = [];

  constructor(private catalogService: CatalogService) {
    this.products = this.catalogService.catalogItems.slice();
  }

  ngOnInit(): void {}
}
