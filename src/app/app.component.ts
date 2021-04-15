import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  vector;
  constructor() { }

  ngOnInit() {
  }
  addItem(newItem) {
    this.vector = newItem;
  }
}