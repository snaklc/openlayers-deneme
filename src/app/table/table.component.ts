import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
  position: string;
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // {position: 'start-finish', name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 'NB',name: 'NB'},
  {position: 'EB', name: 'EB'},
  {position: 'WB',name: 'WB'},
  {position: 'SB',name: 'SB'},
  
];
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['S/F','NB', 'EB', 'WB', 'SB'];
  dataSource = ELEMENT_DATA;
  color = "black";
  constructor() { }

  ngOnInit(): void {
  }

}
