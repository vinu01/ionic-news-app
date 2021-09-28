import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private _bookingSub: Subscription;
  constructor(private bookingService: BookingService) { }

  ngOnInit() {

    this._bookingSub=this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings=bookings;
    })
  }

  onCancelBooking(offerId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    // cancel booking wiht id offerId
  }

  ngOnDestroy(){

    if(this._bookingSub){
      this._bookingSub.unsubscribe();

    }
  }
}
