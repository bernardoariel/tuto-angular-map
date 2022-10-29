import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlaceApiClient } from '../api';
import { ReturnStatement } from '@angular/compiler';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public useLocation: [number, number] | undefined;
  public isLoadingPlaces: boolean = false
  public places: Feature[]=[]

  get isUserLocationReady():boolean{
    //no hay un valor en user location, no hay un valor y lo niego
    return !!this.useLocation;
  }
  constructor( private placeApi:PlaceApiClient ,
    private mapService: MapService) { 
    this.getUserLocation()

  }

  public async getUserLocation(): Promise<[number,number]>{
    return new Promise((resolve,reject)=>{
      navigator.geolocation.getCurrentPosition(
        ({coords})=> {
          this.useLocation = [coords.longitude, coords.latitude]
          resolve(this.useLocation)
        }, 
        (err)=>{
          alert("no se pudo obtener la geolocalizacion")
          console.log(err)
          reject()
        }
      )
    })
  }

  getPlacesByQuery( query: string = ''){
    if(query.length === 0 ){
      this.places = [];
      this.isLoadingPlaces = false;
      return
    }
    if( !this.useLocation ) throw new Error("No hay use location");
    
    this.isLoadingPlaces = true
    this.placeApi.get<PlacesResponse>(`/${query}.json`,{
      params:{
        proximity: this.useLocation!.join(',')
      }
    })
    .subscribe(resp=>{
      this.isLoadingPlaces = false;
      this.places = resp.features;
      this.mapService.createMarkersFromPlaces( this.places, this.useLocation! )
    }

    )
  }

  deletePlaces(){
    this.places = []
  }
}
