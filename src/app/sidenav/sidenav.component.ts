import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../table/table.component';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import Text from 'ol/style/Text';
import {MatSnackBar} from '@angular/material/snack-bar';
import Draw from 'ol/interaction/Draw';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  movementsArray = [];
  directions = true;
  drawMode = false;
  draw;
  allFeatures = [];
  @Input() vectorItem: any;
  @Input() mapItem: any;

  constructor(public dialog: MatDialog, public snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }
  showBorder = false;
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
  freeHandDraw() {
    if (this.mapItem) {
      this.drawMode = !this.drawMode
      if(this.drawMode){
        this.draw = new Draw({
          source: this.vectorItem,
          type: 'LineString',
          freehand: true,
          style: new Style({
          fill: new Fill({
            color: null,
          }),
          stroke: new Stroke({
            color: 'white',
            lineDash: [10],
            width: 5,
            lineCap: 'square',
          }),
          // image: new CircleStyle({
          //   radius: 5,
          //   fill: new Fill({
          //     color: '#87da35',
          //   }),
          // }),
          })
        });
        this.mapItem.addInteraction(this.draw);
      }
      else{
        this.mapItem.removeInteraction(this.draw);
      }
    }
    else{
      this.openSnackBar();
    }
  }
  openSnackBar() {
    this.snackbar.open('Draw linestring first !', 'Close', {
      duration: 2000,
      horizontalPosition:'center' ,
      verticalPosition:  'top',
    });
  }
  mouseEnter(start, end) {
    this.allFeatures = this.vectorItem.getFeatures();
    this.allFeatures.find((feature) => {
      if (feature.values_.name === start || feature.values_.name === end) {
        const style = new Style({
          text: new Text({
            text: feature.values_.name,
            scale: 1.5,
            font: 'Verdana',
            padding: [-5, 5, -5, 8],
            fill: new Fill({
              color: 'green',

            }),
            backgroundFill: new Fill({
              color: 'white'
            }),
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#87da35',
            width: 5,
            
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#87da35',
            }),
          }),
        });
        feature.setStyle(style)
        // console.log(feature.getStyle().getStroke().getColor())
        // feature.getStyle().getStroke().setColor('blue')
      }
    })
  }
  mouseLeave(start, end) {
    this.allFeatures = this.vectorItem.getFeatures();
    this.allFeatures.find((feature) => {
      if (feature.values_.name === start || feature.values_.name === end) {
        const style = new Style({
          text: new Text({
            text: feature.values_.name,
            scale: 1.5,
            font: 'Verdana',
            padding: [-5, 5, -5, 8],
            fill: new Fill({
              color: 'green',
            }),
            backgroundFill: new Fill({
              color: 'white'
            }),
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: 'white',
            width: 5,
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#87da35',
            }),
          }),
        });
        feature.setStyle(style)
        // console.log(feature.getStyle().getStroke().getColor())
        // feature.getStyle().getStroke().setColor('blue')
      }
    })
  }
}
