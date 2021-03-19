import { Injectable } from '@angular/core';
export interface ILineString{
  name: string,
  coordinates: Array<any>,
  id: number
}
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

 lines: ILineString[] = [];

}
