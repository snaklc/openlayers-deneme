import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  vector;
  map;
  constructor() { }

  ngOnInit() {
  }
  addItem(newItem) {
    this.vector = newItem;
  }
  addMap(mapItem) {
    console.log('mapaaa', mapItem)
    this.map = mapItem;
  }
}