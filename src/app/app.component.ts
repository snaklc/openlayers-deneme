import { Map, View } from 'ol';
import { Component, ElementRef, ViewChild } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import { getCenter } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Modify, Snap } from 'ol/interaction';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import Text from 'ol/style/Text';
import GeoJSON from 'ol/format/GeoJSON';
import { DataService } from './data.service';

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
  lineName;
  coordinates;
  obj;
  constructor(public dialog: MatDialog, private dataService: DataService) { }

  ngOnInit() {
    this.initMap();
  }
  /**
   * Harita ve katmanlarının oluşturulduğu fonksiyon
   */
  initMap() {
    const extent = [0, 0, 1060, 500]
    this.imageLayer = new ImageLayer({
      source: new ImageStatic({
        url: '/assets/OrnekKavsak.jpg',
        projection: new Projection({
          code: 'local-image',
          units: 'pixels',
          extent: extent
        }),
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
        // text: new Text({
        //   text: `${this.lineName}`,
        //   scale: 1.7,
        //   fill: new Fill({
        //     color: '#000000'
        //   }),
        // }),
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
        // projection: projection,
        center: getCenter(extent),
        // zoom: 0,
        // maxZoom: 0,
      }),
    });
    const modify = new Modify({
      source: this.source,
      insertVertexCondition: false
    })
    // Interaction'ı haritaya ekledik
    this.map.addInteraction(modify);
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
        geometryName: `${this.lineName}`,
      })
      this.map.addInteraction(this.draw);
      this.snap = new Snap({
        source: this.source,
        vertex: false
      });
      this.map.addInteraction(this.snap);
      // Çizim tamamlandıktan sonra popup açılması için
      this.draw.on('drawend', (arg) => {
        this.openPopup();
        let parser = new GeoJSON();
        this.coordinates = parser.writeFeatureObject(arg.feature);
        // Dataservice'e eklenecek olan linestring objesi
        this.obj = {
          name: '',
          coord: this.coordinates.geometry.coordinates
        }

      })

    }
    else {
      this.drawingModeOff();

    }
    if (this.draw.maxPoints === 2) {
      this.openPopup();
    }
  }
  openPopup() {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '260px',
      height: '260px',
      data: { name: this.lineName }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.lineName = result;
      console.log('lineName', this.lineName)
      // return this.lineName;
      //linestring isimlemdirme
      // var text = this.vector;
      // text.getStyle().getText().setText(this.lineName);
      // console.log('newText', text.getStyle().getText().text_)
      this.obj.name = this.lineName
      console.log(this.obj)
      this.dataService.lines.push(this.obj)
      console.log(this.dataService.lines)

    });
    // return this.lineName;
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