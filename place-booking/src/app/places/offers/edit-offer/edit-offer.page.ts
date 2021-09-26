import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FormGroup,FormControl,Validators } from '@angular/forms';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}
  

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      // this.place = this.placesService.getPlace(paramMap.get('placeId'));
      // this.form=new FormGroup({
      //   title: new FormControl(this.place.title,{
      //     updateOn:'blur',
      //     validators:[Validators.required]
      //   }),
      //   description: new FormControl(this.place.description,{
      //     updateOn:'blur',
      //     validators:[Validators.required, Validators.maxLength(180)]
      //   }),

      // });

      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            })
          });
        });
    });
  }

  onEditOffer(){
    if(!this.form.valid){
      console.log("If form not valid!!");
      return;
    }
    this.loadingCtrl.create({
      message: 'Updateing Place...',
    }).then(loadingEl =>{
      loadingEl.present();
      this.placesService.onUpdate(this.place.id, this.form.value.title, this.form.value.description).subscribe(() =>{
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
        console.log(this.form)
      });
    })

  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
