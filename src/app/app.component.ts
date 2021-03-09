import { Map, View } from 'ol';
import { Component, ElementRef, ViewChild } from '@angular/core';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import { getCenter } from 'ol/extent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('map', { static: true }) mapRef: ElementRef;
  title = 'deneme';
  imageLayer: ImageLayer;
  map: Map;
  selected:boolean = true;
  vehicleArray = [
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
  constructor() {}
  ngOnInit() {
    this.initMap();
  }
  initMap() {
    this.imageLayer = new ImageLayer({
      source: new Static({
        url: '/assets/OrnekKavsak.jpg',
        imageExtent: [0, 0, 1760, 1000],
      }),
    })

    this.map = new Map({
      layers: [this.imageLayer],
      target: this.mapRef.nativeElement,
      controls: [], // zoomIn zoomOut buttonlarını gizler
      interactions: [], //image'in hareket etmemesini saglar
      view: new View({
        resolution: 1,        // important for 100% image size!
        maxResolution: 2,     // must be >= 1
        // projection: projection,
        center: getCenter([0, 0, 1760, 1000]),
        zoom: 0,
        maxZoom: 0,
      }),
    });
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