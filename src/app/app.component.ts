import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // title = 'deneme';
  // imageLayer: ImageLayer;
  // selected: boolean = true;
  // source;
  // vector;
  // draw;
  // modify;
  // drawMode = false;
  // modifyMode = false;
  // defaultlineName = 'line';
  // coordinates;
  // lineObj;
  // counter: number = 1;
  // modifiedCoordinate;
  // movementsArray = [];
  constructor() { }

  ngOnInit() {
  }
  addItem(newItem) {
    console.log('appegeldi', newItem)
  }
}