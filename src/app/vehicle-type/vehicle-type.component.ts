import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit {
  vehicleArray = [];
  selected: boolean = true;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.vehicleArray = this.dataService.vehicleArray

  }
  vehicleSelected(vehicle) {
    vehicle.checked = !vehicle.checked;
  }
  selectAll() {
    this.vehicleArray.find(item => {
      item.checked = true;
      this.selected = false;
    })
  }
  deselectAll() {
    this.vehicleArray.find(item => {
      item.checked = false;
      this.selected = true;
    })
  }
}
