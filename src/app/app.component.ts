import { Map, View } from 'ol';
import { Component, ElementRef, ViewChild } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import { getCenter } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Modify, Snap } from 'ol/interaction';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import Text from 'ol/style/Text';
import GeoJSON from 'ol/format/GeoJSON';
import { DataService, ILineString } from './data.service';
import { TableComponent } from './table/table.component';
import { ThrowStmt } from '@angular/compiler';
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
  selected: boolean = true;
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
  source;
  vector;
  draw;
  snap;
  drawMode = false;
  defaultlineName = 'line';
  lineName;
  coordinates;
  lineObj;
  counter: number = 1;
  modifiedCoordinate;
  constructor(public dialog: MatDialog, private dataService: DataService) { }

  ngOnInit() {
    this.initMap();
  }
  /**
   * Harita ve katmanlarının oluşturulduğu fonksiyon
   */
  initMap() {
    const extent = [0, 0, 1060, 500]
    const projection = new Projection({
      code: 'local-image',
      units: 'pixels',
      extent: extent
    })
    this.imageLayer = new ImageLayer({
      source: new ImageStatic({
        url: '/assets/OrnekKavsak.jpg',
        projection: projection,
        imageExtent: extent
      }),
    })
    /**
     * Vector layer oluşturma
     */
    this.source = new VectorSource();
    this.vector = new VectorLayer({
      source: this.source,
      style: new Style({
        text: new Text({
          text: 'line',
          scale: 1.5,
          font: 'Verdana',
          padding: [-5, 5, -5, 8],
          fill: new Fill({
            color: 'green',

          }),
          backgroundFill: new Fill({
            color: 'white'
          }),
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 5,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: 'white',
          }),
        }),
      }),
    });
    /**
     * Harita oluşturma
     */
    this.map = new Map({
      layers: [this.imageLayer, this.vector],
      target: this.mapRef.nativeElement,
      controls: [], // zoomIn zoomOut buttonlarını gizler
      interactions: [], //image'in hareket etmemesini saglar
      view: new View({
        resolution: 1,        // important for 100% image size!
        maxResolution: 2,     // must be >= 1
        projection: projection,
        center: getCenter(extent),
        // zoom: 0,
        // maxZoom: 0,
      }),
    });
    const modify = new Modify({
      source: this.source,
    })
    // Interaction'ı haritaya ekledik
    this.map.addInteraction(modify);
    modify.on('modifyend', function (event) {
      this.modifiedCoordinate = event.mapBrowserEvent.coordinate;
      // console.log(this.modifiedCoordinate);

      // console.log(event.features.feature.geometryName)
      // this.target.style.cursor = e.type === 'modifystart' ? 'grabbing' : 'pointer';

    });
  }
  /**
   * Line çizmeye yarayan fonksiyon
   */
  drawLine() {
    this.drawMode = !this.drawMode;
    if (this.drawMode === true) {

      this.draw = new Draw({
        source: this.source,
        type: 'LineString',
        minPoints: 2,
        maxPoints: 2,

      })
      console.log('draw', this.draw)
      this.map.addInteraction(this.draw);
      // this.snap = new Snap({
      //   source: this.source,
      //   vertex: false
      // });
      // this.map.addInteraction(this.snap);
      // Çizim tamamlandıktan sonra popup açılması ve coordinata ulaşabilmemiz için
      this.draw.on('drawend', (arg) => {
        this.openPopup();
        let parser = new GeoJSON();
        this.coordinates = parser.writeFeatureObject(arg.feature);

        var feature = arg.feature;
        var features = this.vector.getSource().getFeatures();
        features = features.concat(feature);
        features.forEach((e)=> {
          console.log('herbir feature' , e)
        });
        // Dataservice'e eklenecek olan linestring objesi
        this.lineObj = {
          name: '',
          coord: this.coordinates.geometry.coordinates,
          id: this.counter++
        }
      })
    }
    else {
      this.drawingModeOff();

    }
  }
  setNameToLines() {
    this.dataService.lines.find((line) => {
      // line.name
    })
  }
  openPopup() {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '260px',
      height: '260px',
      // data: { name: this.lineName }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.lineName = result;
      console.log('lineName', this.lineName)
      // this.lineObj.name = this.lineName
      // console.log('obj', this.lineObj)
      // this.dataService.lines.push(this.lineObj)
      // console.log('dataservices', this.dataService.lines)
      // this.vector.style_.text_.text_ = this.dataService.lines[0].name
      return this.lineName;
    });
    return this.lineName;
  }
  openTable() {
    const dialogRef = this.dialog.open(TableComponent, {
      width: '450px',
      height: '400px',
      // data: { name: this.lineName }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('table result', result)
    });
  }
  drawingModeOff() {
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
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