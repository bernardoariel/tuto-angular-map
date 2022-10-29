import { AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {  MapService, PlacesService } from '../../services';
import { Map, Popup, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  
  @ViewChild('mapDiv') mapDivElement!: ElementRef
  constructor( 
    private placeService:PlacesService, 
    private mapService: MapService 
  ) { }

  ngAfterViewInit(): void {
    
    if( !this.placeService.useLocation) throw Error('No hay placesSErvice.userLocation')

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.placeService.useLocation, // starting position [lng, lat]
      zoom: 14, // starting zoom
      
    });

    const popup = new Popup()
      .setHTML(`
      <h6>Aquí estoy</h6>
      <span>Estoy en este lugar del mundo</span>
    `)
    new Marker({color:'red'})
      .setLngLat(this.placeService.useLocation)
      .setPopup(popup)
      .addTo( map );

      this.mapService.setMap( map )
  }



}
