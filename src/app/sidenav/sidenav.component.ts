import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../table/table.component';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  movementsArray = [];
  directions = true;
  allFeatures = [];
  @Input() vectorItem: any;

  constructor(public dialog: MatDialog) { }

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
  mouseEnter(start, end) {
    this.allFeatures = this.vectorItem.getFeatures();
    this.allFeatures.find((feature) => {
      if (feature.values_.name === start || feature.values_.name === end) {
        const style = new Style({
          // text: new Text({
          //   text: feature.values_.name,
          //   scale: 1.5,
          //   font: 'Verdana',
          //   padding: [-5, 5, -5, 8],
          //   fill: new Fill({
          //     color: 'green',

          //   }),
          //   backgroundFill: new Fill({
          //     color: 'white'
          //   }),
          // }),
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
}
