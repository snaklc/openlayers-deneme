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
    this.allFeatures.find((feature) =>{
      if(feature.values_.name === start || feature.values_.name === end){
        console.log(feature)
        console.log(feature.getStyle().getStroke().getColor())
        feature.getStyle().getStroke().setColor('blue')
      }
        console.log('feature',feature.getValues());
        
        
    })

    
  }
}
