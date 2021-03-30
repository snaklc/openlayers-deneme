import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
export interface IColumn {
  name: string;
}
const ELEMENT_DATA: IColumn[] = [
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
  movementsArray = [];
  movementObj = { checked: false, startPoint: "", endPoint: "" };
  displayedColumns: string[] = ['S/F', 'NB', 'EB', 'WB', 'SB'];
  dataSource = ELEMENT_DATA;
  color = "black";
  constructor() { }

  ngOnInit(): void {
  }

  onChecked(event, baslangic, bitis) {
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
      this.movementsArray = this.getFilteredMovements(this.movementsArray)
      console.log('movements array', this.movementsArray)
    }
    else {
      this.movementsArray.push(this.movementObj)
      this.movementsArray = this.getFilteredMovements(this.movementsArray)
      console.log('movements array', this.movementsArray)
    }
  }

  getFilteredMovements(arr) {
    const filteredArray = arr.filter(item => item.checked === true)
    return filteredArray;
  }
}
