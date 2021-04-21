import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Map, View } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import { getCenter } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Icon, Fill, Stroke, Style } from 'ol/style';
import { Draw, Modify } from 'ol/interaction';
import { MatDialog } from '@angular/material/dialog';
import Text from 'ol/style/Text';
import GeoJSON from 'ol/format/GeoJSON';
import Select from 'ol/interaction/Select';
import { ElementRef } from '@angular/core';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { DataService } from '../services/data.service';
import { doubleClick } from 'ol/events/condition';
import { Output, EventEmitter } from '@angular/core';
import RegularShape from 'ol/style/RegularShape'; @Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Output() vectorEvent = new EventEmitter<any>();
  @Output() mapEvent = new EventEmitter<any>();
  @ViewChild('map', { static: true }) mapRef: ElementRef;
  imageLayer: ImageLayer;
  mapSource: Map;
  selected: boolean = true;
  source;
  vector;
  draw;
  modify;
  drawMode = false;
  modifyMode = false;
  // selectMode = false;
  lineCounter = 1;
  defaultlineName = 'line';
  coordinates;
  lineObj;
  counter: number = 1;
  modifiedCoordinate;
  select;
  linesArray = [];
  constructor(public dialog: MatDialog, private dataService: DataService) {
    this.linesArray = dataService.lines;
  }
  /**
   * Esc ye basınca drawing ve modifying mode kapanması için
   */
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.drawingModeOff();
    this.modifyModeOff();
  }
  ngOnInit(): void {
    this.initMap();
  }
  addNewItem(vector, map) {
    this.vectorEvent.emit(vector);
    this.mapEvent.emit(map);
  }
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
        // text: new Text({
        //   text: this.defaultlineName + this.lineCounter,
        //   scale: 1.5,
        //   font: 'Verdana',
        //   padding: [-5, 5, -5, 8],
        //   fill: new Fill({
        //     color: 'green',
        //   }),
        //   backgroundFill: new Fill({
        //     color: 'white'
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
            color: 'red',
          }),
        }),
      }),
    });
    /**
     * Harita oluşturma
     */
    this.mapSource = new Map({
      layers: [this.imageLayer, this.vector],
      target: this.mapRef.nativeElement,
      controls: [], // zoomIn zoomOut buttonlarını gizler
      interactions: [], //image'in hareket etmemesini saglar
      view: new View({
        resolution: 1,        // important for 100% image size!
        maxResolution: 2,     // must be >= 1
        projection: projection,
        center: getCenter(extent),
      }),
    });
    // Lineları click ile seçmek ve modify etmek için
    let selectClick = new Select({
      condition: doubleClick,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: 'yellow',
          width: 5,
        }),
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({
            color: 'red',
          }),
        }),
      })
    });

    this.select = selectClick; // ref to currently selected interaction
    if (this.select !== null) {
      // this.selectMode = true;
      this.mapSource.addInteraction(this.select);
      this.select.on('select', (e) => {
        if (e.selected.id_ !== null) {
          this.modifyLine();
        }
        else {
          this.modifyModeOff()
        }
        console.log('select', e)
        return e.selected;
      });
    }
    else {
      this.modifyModeOff();
      // this.deleteModeOff();
      this.mapSource.removeInteraction(this.select)
      console.log(this.linesArray)
    }
    /**
     * LineString üzerine geldiğinde cursor değişmesi için
     */
    this.mapSource.on("pointermove", function (evt) {
      var hit = this.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (feature.getGeometry().getType() === "LineString") {
          return true;
        }
        else {
          return false;
        }
      });
      if (hit) {
        this.getTargetElement().style.cursor = 'move';
      }
      else if (evt.dragging) {
        this.getTargetElement().style.cursor = 'move';
      } 
      else {
        this.getTargetElement().style.cursor = '';
      }
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
      this.mapSource.addInteraction(this.draw);
      // Çizim tamamlandıktan sonrası
      this.draw.on('drawend', (arg) => {
        this.drawingModeOff();
        //koordinat bilgisi
        let parser = new GeoJSON();
        this.coordinates = parser.writeFeatureObject(arg.feature);
        //cizilen featurea id atama
        var feature = arg.feature;
        feature.setId(this.counter++)
        //text bilgisini style'a ekledik
        this.openPopup().then((res) => {
          if (res) {
            const style = new Style({
              text: new Text({
                text: res,
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
                  color: '#87da35',
                }),
              }),
            });
            feature.setStyle(style)
            feature.set('name', res)
            console.log('featureName', feature.values_.name)
            // Dataservice'e eklenecek olan linestring objesi
            this.lineObj = {
              name: feature.values_.name,
              coordinates: this.coordinates.geometry.coordinates,
              id: feature.getId()
            }
            this.linesArray.push(this.lineObj)
            console.log(this.linesArray)
          }
          else {

          }
        });
      })
    }
    else {
      this.drawingModeOff();
    }
  }

  modifyLine() {
    let select = new Select();
    this.modifyMode = !this.modifyMode;
    if (this.modifyMode === true) {
      this.modify = new Modify({
        source: this.source,
        features: this.select.getFeatures(),
        style: new Style({
          stroke: new Stroke({
            color: 'transparent',
            width: 5
          })
        }),
        insertVertexCondition: function () {
          // prevent new vertices to be added to the linestring
          return !select
            .getFeatures()
            .getArray()
            .every(function (feature) {
              return feature
                .getGeometry()
                .getType()
                .match(/LineString/);
            });
        },
      })
      // Modify Interaction'ı haritaya ekledik
      this.mapSource.addInteraction(this.modify);
      this.modify.on('modifyend', (event) => {
        //modified feature'ın koordinatları
        if (event.features.item(0) !== undefined) {
          const modifiedItemId = event.features.item(0).getId();
          const newCoord = event.features.item(0).getGeometry().getCoordinates();
          // DataServiste coordinatları güncelledik.
          this.linesArray.map((findedLine) => {
            if (findedLine.id === modifiedItemId) {
              findedLine.coordinates = newCoord;
            }
          })
        }
        else {
          console.log('Vertexler modify edilemez!!')
        }
      });
    }
    else {
      this.modifyModeOff();
    }
  }
  deleteLine() {
    
    let selectedLine = this.select.features_.array_;
    if (selectedLine !== null) {
      let selectedLineId = selectedLine[0].getId();
      let features = this.source.getFeatures();
      if (features != null && features.length > 0) {
        features.forEach(element => {
          if (element.getId() === selectedLineId) {
            //line'ı mapten kaldır
            this.source.removeFeature(element);
            //line'ı dataserviceten sil
            this.linesArray = this.filterArrays(this.linesArray, selectedLineId)
            this.modifyModeOff();
          }
        });
      }
    }
    else{
      this.modifyModeOff();
    }
  }
  filterArrays(arr, selectedLineId) {
    return arr.filter(f => f.id !== selectedLineId)
  }
  async openPopup() {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '260px',
      height: '260px',
      // data: { name: this.lineName }
    });
    const result = await dialogRef.afterClosed().toPromise();
    return result;
  }
  drawingModeOff() {
    this.mapSource.removeInteraction(this.draw);
    this.drawMode = false;

  }
  modifyModeOff() {
    this.mapSource.removeInteraction(this.modify);
    this.modifyMode = false;
  }
  // selectModeOff(){
  //   this.mapSource.removeInteraction(this.select)
  //   this.selectMode = false;
  // }
}
