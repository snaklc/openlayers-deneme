import { Injectable } from '@angular/core';
export interface ILineString{
  name: string,
  coordinates: Array<any>,
  id: number
}
export interface IVehicle{
  type: string,
  checked: boolean
}
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

 lines: ILineString[] = [];
 vehicleArray: IVehicle[] = [
  {
    type: "car",
    checked: false
  },
  {
    type: "truck",
    checked: false
  },
  {
    type: "van",
    checked: false
  },
  {
    type: "motorcycle",
    checked: false
  },
  {
    type: "bus",
    checked: false
  },
  {
    type: "bicycle",
    checked: false
  },
  {
    type: "person",
    checked: false
  }
]
}
