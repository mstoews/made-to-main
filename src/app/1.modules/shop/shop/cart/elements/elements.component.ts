import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
//import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

declare var Stripe; // : stripe.StripeStatic;

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
})
export class ElementsComponent implements OnInit, AfterViewInit {


  constructor(private auth: AngularFireAuthModule ) {}

  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement') cardElement: ElementRef;

  stripe; // : stripe.Stripe;
  card;
  cardErrors;

  loading = false;
  confirmation;


  ngAfterViewInit(): void {
    console.log('ElementsComponent ngAfterViewInit');
    this.stripe = Stripe('pk_test_...');
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) => {
        this.cardErrors = error && error.message;
    });

  }

  ngOnInit() {
    console.log('ElementsComponent ngOnInit');
  }

  async handleForm(e) {
    e.preventDefault();

    const { source, error } = await this.stripe.createSource(this.card);

    if (error) {
      // Inform the customer that there was an error.
      const cardErrors = error.message;
    } else {
      // Send the token to your server.
      this.loading = true;
      //const user = await this.auth.getUser();
      //const fun = this.functions.httpsCallable('stripeCreateCharge');
      //this.confirmation = await fun({ source: source.id, uid: user.uid, amount: this.amount }).toPromise();
      this.loading = false;

    }
  }



}
