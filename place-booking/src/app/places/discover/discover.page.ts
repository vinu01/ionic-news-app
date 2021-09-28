import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  releventPlaces: Place[];
  private placesSub: Subscription;


  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.releventPlaces=this.loadedPlaces;
      this.listedLoadedPlaces = this.releventPlaces.slice(1);
    });
  }

 

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if(event.detail.value === 'all'){
      this.releventPlaces=this.loadedPlaces;
      this.listedLoadedPlaces = this.releventPlaces.slice(1);
    }
    else{
      this.releventPlaces=this.loadedPlaces.filter(
        place => place.userId != this.authService.userId
      );
      this.listedLoadedPlaces = this.releventPlaces.slice(1);
    }
    
    console.log(event.detail);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
