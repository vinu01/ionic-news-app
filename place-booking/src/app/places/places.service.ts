import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

import { Place } from './place.model';

interface PlaceData{
availableFrom: string;
availableTo: string;
description: string;
imageUrl: string;
price: number;
title: string;
userId: string;
}

// [
//   new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York City.',
//     'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p2',
//     "L'Amour Toujours",
//     'A romantic place in Paris!',
//     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
//     189.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p3',
//     'The Foggy Palace',
//     'Not your average city trip!',
//     'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
//     99.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   )
// ]

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places= new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlace(){
    return this.http.get<{[key:string]: PlaceData}>(
      'https://place-booking-d37a0-default-rtdb.firebaseio.com/offerd-places.json')
    .pipe(map(resData =>{
        const places=[];

        for(const key in resData){

          if(resData.hasOwnProperty(key)){
            places.push(new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId
              )
              );

          }
        }
      return places;
        // return [] of array

    }),
    tap(places => {
      this._places.next(places);
    })
    
    );
  }
  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map(places => {
        return { ...places.find(p => p.id === id) };
      })
    );
  }

  addPlace(title: string, description: string, price: number,dateFrom: Date, dateTo:Date){
  
    let generatedId: string;
    const newPlace= new Place(
      Math.random().toString(),
      title,description,
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    
    return this.http.post<{ name: string }>('https://place-booking-d37a0-default-rtdb.firebaseio.com/offerd-places.json',
    {
      ...newPlace,
      id: null
    }
    )
    .pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places=>{
      
    //     this._places.next(places.concat(newPlace));
     
    // })
    // );
      
  }

  onUpdate(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://place-booking-d37a0-default-rtdb.firebaseio.com/offerd-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
