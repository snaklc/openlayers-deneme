import { Map, View } from 'ol';
import { Component, ElementRef, ViewChild } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import { getCenter } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Modify } from 'ol/interaction';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import Text from 'ol/style/Text';
import GeoJSON from 'ol/format/GeoJSON';
import { DataService, ILineString } from './services/data.service';
import { TableComponent } from './table/table.component';
import Select from 'ol/interaction/Select';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // @ViewChild('map', { static: true }) mapRef: ElementRef;
  title = 'deneme';
  imageLayer: ImageLayer;
  map: Map;
  selected: boolean = true;
  source;
  vector;
  draw;
  modify;
  drawMode = false;
  modifyMode = false;
  defaultlineName = 'line';
  coordinates;
  lineObj;
  counter: number = 1;
  modifiedCoordinate;
  movementsArray = [];
  constructor(public dialog: MatDialog, private dataService: DataService) { }

  ngOnInit() {
    // this.initMap();
  }
  /**
   * Harita ve katmanlarının oluşturulduğu fonksiyon
   */
  // initMap() {
  //   const extent = [0, 0, 1060, 500]
  //   const projection = new Projection({
  //     code: 'local-image',
  //     units: 'pixels',
  //     extent: extent
  //   })
  //   this.imageLayer = new ImageLayer({
  //     source: new ImageStatic({
  //       url: '/assets/OrnekKavsak.jpg',
  //       projection: projection,
  //       imageExtent: extent
  //     }),
  //   })
  //   /**
  //    * Vector layer oluşturma
  //    */
  //   this.source = new VectorSource();
  //   this.vector = new VectorLayer({
  //     source: this.source,
  //     style: new Style({
  //       fill: new Fill({
  //         color: 'rgba(255, 255, 255, 0.2)',
  //       }),
  //       stroke: new Stroke({
  //         color: 'white',
  //         width: 5,
  //       }),
  //       image: new CircleStyle({
  //         radius: 7,
  //         fill: new Fill({
  //           color: 'white',
  //         }),
  //       }),
  //     }),
  //   });
  //   /**
  //    * Harita oluşturma
  //    */
  //   this.map = new Map({
  //     layers: [this.imageLayer, this.vector],
  //     target: this.mapRef.nativeElement,
  //     controls: [], // zoomIn zoomOut buttonlarını gizler
  //     interactions: [], //image'in hareket etmemesini saglar
  //     view: new View({
  //       resolution: 1,        // important for 100% image size!
  //       maxResolution: 2,     // must be >= 1
  //       projection: projection,
  //       center: getCenter(extent),
  //     }),
  //   });
  // }
  // /**
  //  * Line çizmeye yarayan fonksiyon
  //  */
  // drawLine() {
  //   this.drawMode = !this.drawMode;
  //   if (this.drawMode === true) {
  //     this.draw = new Draw({
  //       source: this.source,
  //       type: 'LineString',
  //       minPoints: 2,
  //       maxPoints: 2,
  //     })
  //     console.log('draw', this.draw)
  //     this.map.addInteraction(this.draw);
  //     // Çizim tamamlandıktan sonrası
  //     this.draw.on('drawend', (arg) => {
  //       //koordinat bilgisi
  //       let parser = new GeoJSON();
  //       this.coordinates = parser.writeFeatureObject(arg.feature);
  //       //cizilen featurea id atama
  //       var feature = arg.feature;
  //       feature.setId(this.counter++)
  //       //text bilgisini style'a ekledik
  //       this.openPopup().then((res) => {
  //         const style = new Style({
  //           text: new Text({
  //             text: res,
  //             scale: 1.5,
  //             font: 'Verdana',
  //             padding: [-5, 5, -5, 8],
  //             fill: new Fill({
  //               color: 'green',

  //             }),
  //             backgroundFill: new Fill({
  //               color: 'white'
  //             }),
  //           }),
  //           fill: new Fill({
  //             color: 'rgba(255, 255, 255, 0.2)',
  //           }),
  //           stroke: new Stroke({
  //             color: 'white',
  //             width: 5,
  //           }),
  //           image: new CircleStyle({
  //             radius: 7,
  //             fill: new Fill({
  //               color: '#87da35',
  //             }),
  //           }),
  //         });
  //         feature.setStyle(style)
  //         feature.set('name', res)
  //         console.log('feature', feature.values_.name)
  //         // Dataservice'e eklenecek olan linestring objesi
  //         this.lineObj = {
  //           name: feature.values_.name,
  //           coordinates: this.coordinates.geometry.coordinates,
  //           id: feature.getId()
  //         }
  //         this.dataService.lines.push(this.lineObj)
  //         console.log(this.dataService.lines)

  //       });
  //     })
  //   }
  //   else {
  //     this.drawingModeOff();
  //   }
  // }

  // modifyLine() {
  //   this.modifyMode = !this.modifyMode
  //   if (this.modifyMode === true) {

  //     var select = new Select({
  //       // style: overlayStyle,
  //     });
  //     this.modify = new Modify({
  //       source: this.source,
  //       style: new Style({
  //         fill: new Fill({
  //           color: 'rgba(255, 255, 255, 0.2)',
  //         }),
  //         stroke: new Stroke({
  //           color: '#ffcc33',
  //           width: 2,
  //         }),
  //         image: new CircleStyle({
  //           radius: 7,
  //           fill: new Fill({
  //             color: '#ffcc33',
  //           }),
  //         }),
  //       }),
  //       insertVertexCondition: function () {
  //         // prevent new vertices to be added to the linestring
  //         return !select
  //           .getFeatures()
  //           .getArray()
  //           .every(function (feature) {
  //             return feature
  //               .getGeometry()
  //               .getType()
  //               .match(/LineString/);
  //           });
  //       },
  //     })
  //     // Modify Interaction'ı haritaya ekledik
  //     this.map.addInteraction(this.modify);
  //     this.modify.on('modifyend', (event) => {
  //       //modified feature'ın koordinatları
  //       if(event.features.item(0) !== undefined){
  //         const modifiedItemId = event.features.item(0).getId();
  //         const newCoord = event.features.item(0).getGeometry().getCoordinates();
  //         // DataServiste coordinatları güncelledik.
  //         this.dataService.lines.map((findedLine) => {
  //           if (findedLine.id === modifiedItemId) {
  //             findedLine.coordinates = newCoord;
  //           }
  //         })
  //       }
  //       else{
  //         console.log('Vertexler modify edilemez!!')
  //       }
  //     });
  //   }
  //   else {
  //     this.modifyModeOff();
  //   }
  // }
  // async openPopup() {
  //   const dialogRef = this.dialog.open(DialogBoxComponent, {
  //     width: '260px',
  //     height: '260px',
  //     // data: { name: this.lineName }
  //   });
  //   const result = await dialogRef.afterClosed().toPromise();
  //   return result;
  // }
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
  // drawingModeOff() {
  //   this.map.removeInteraction(this.draw);
  // }
  // modifyModeOff() {
  //   this.map.removeInteraction(this.modify);
  // }
}