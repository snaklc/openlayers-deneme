import { Map, View } from 'ol';
import { Component, ElementRef, ViewChild } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke, Text, Icon } from 'ol/style';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import { getCenter } from 'ol/extent';
import { Circle as CircleStyle } from 'ol/style';

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
  selectedType;
  carClicked = false;

  constructor() {
  }

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

  carSelected() {
    this.carClicked = !this.carClicked;
  }
}