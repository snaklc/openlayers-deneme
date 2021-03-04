import { Map, View } from 'ol';
import { Component } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke, Text, Icon } from 'ol/style';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import {getCenter} from 'ol/extent';
import {Circle as CircleStyle} from 'ol/style';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'deneme';

  private vectorLayer: VectorLayer;
  private imageLayer: ImageLayer;
  map: Map;
  selectedType;

  constructor() {
  }

  ngOnInit(){
    this.initMap();
    console.log(this.selectedType);
    
  }
  

  initMap() {

    const extent = [0, 0, 1760, 1000];
    // const projection = new Projection({
    //   // code: 'xkcd-image',
    //   units: 'pixels',
    //   extent: extent,
    // });
     this.imageLayer =  new ImageLayer({
      source: new Static({
        // attributions: '© <a href="http://xkcd.com/license.html">xkcd</a>',
        url: '/assets/OrnekKavsak.jpg',
        // projection: projection,
        imageExtent: extent,
      }),
    })

    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      }),
    });

     this.map = new Map({
      layers: [this.imageLayer, this.vectorLayer],
      target: 'map',
      controls: [], // zoomIn zoomOut buttonlarını gizler
      interactions:[], //image'in hareket etmemesini saglar
      view: new View({
        resolution: 1,        // important for 100% image size!
        maxResolution: 2,     // must be >= 1
        // projection: projection,
        center: getCenter(extent),
        zoom: 0,
        maxZoom: 0,

      }),
    });

    

  }

  

 
}