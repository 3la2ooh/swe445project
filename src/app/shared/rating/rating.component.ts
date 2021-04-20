import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() rating: number;

  constructor() { }

  ngOnInit(): void {
  }

  get flooredRating(): number {
    return Math.floor(this.rating);
  }

  get ceiledRating(): number {
    return Math.ceil(this.rating);
  }

  iterableRating(size: number): number[] {
    return Array(size).fill(0).map((x, i) => i);
  }
}
