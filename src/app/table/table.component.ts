import { Component, OnInit } from '@angular/core';
export interface IColumName {
  name: string;
}

const columnNames: IColumName[] = [
  // {position: 'start-finish', name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
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
  displayedColumns: string[] = ['S/F', 'NB', 'EB', 'WB', 'SB'];
  dataSource = columnNames;
  color = "black";
  constructor() { }

  ngOnInit(): void {
  }

}
