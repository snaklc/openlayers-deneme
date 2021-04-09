import { Component } from '@angular/core';
import ImageLayer from 'ol/layer/Image';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from './services/data.service';
import { TableComponent } from './table/table.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'deneme';
  imageLayer: ImageLayer;
  selected: boolean = true;
  source;
  vector;
  draw;
  modify;
  drawMode = false;
  modifyMode = false;
  defaultlineName = 'line';
  coordinates;
  lineObj;
  counter: number = 1;
  modifiedCoordinate;
  movementsArray = [];
  constructor(public dialog: MatDialog, private dataService: DataService) { }

  ngOnInit() {
    // this.initMap();
  }
  openTable() {
    const dialogRef = this.dialog.open(TableComponent, {
      width: '450px',
      height: '400px',
      // data: { name: this.lineName }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movementsArray = result
      }
    });
  }
}