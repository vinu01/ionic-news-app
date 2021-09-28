import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
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
  constructor(private bookingService: BookingService, private loadingCtrl: LoadingController) { }

  ngOnInit() {

    this._bookingSub=this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings=bookings;
    })
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();

    this.loadingCtrl.create({message:'Cancelling...'}).then(loadingEl =>{
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() =>
      {
        loadingEl.dismiss();
      });

    });
    // cancel booking wiht id bookingId

      
    

  }

  ngOnDestroy(){

    if(this._bookingSub){
      this._bookingSub.unsubscribe();

    }
  }
}
