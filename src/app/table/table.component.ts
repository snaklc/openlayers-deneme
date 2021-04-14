import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { DataService } from '../services/data.service';
export interface IRow {
  name: string;
}
const ELEMENT_ROW_DATA: IRow[] = [
  { name: 'NB' },
  { name: 'EB' },
  { name: 'WB' },
  { name: 'SB' },
];
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild(MapComponent)
  mapComponent: MapComponent;
  rows = [];
  movementsArray = [];
  dataSource;
  movementObj = { checked: false, startPoint: "", endPoint: "" };
  displayedColumns: string[] = ["S/F"];
  color = "black";
  constructor(private dataService: DataService) {
    this.dataService.lines.find((line) => {
      const rowNames = {
        name: line.name
      }
      this.rows.push(rowNames)
      console.log('rowNames', rowNames)
      this.dataSource = this.rows;
      console.log('dataSource', this.dataSource)
      this.displayedColumns.push(rowNames.name)
      console.log('displayColum', this.displayedColumns)
    })
  }
  ngOnInit(): void {
  }
  onChecked(event, baslangic, bitis) {
    console.log(event, baslangic, bitis)
    this.movementObj = {
      checked: event.checked,
      startPoint: baslangic.name,
      endPoint: bitis
    }
    const findObj = this.movementsArray.find((obj) => {
      if (obj.startPoint === this.movementObj.startPoint && obj.endPoint === this.movementObj.endPoint) {
        return true;
      }
    })
    if (findObj) {
      findObj.checked = this.movementObj.checked;
    }
    else {
      this.movementsArray.push(this.movementObj)
    }
    this.movementsArray = this.getFilteredMovements(this.movementsArray)
    console.log('movements array', this.movementsArray)
  }
  getFilteredMovements(arr) {
    const filteredArray = arr.filter(item => item.checked === true)
    return filteredArray;
  }
}
