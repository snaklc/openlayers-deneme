import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  movementsArray = [];
  directions = true;

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
}
