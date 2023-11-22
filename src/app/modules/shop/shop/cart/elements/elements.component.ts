import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
//import { AuthService } from 'src/app/services/auth.service';


declare var Stripe; // : stripe.StripeStatic;

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
})
export class ElementsComponent implements OnInit, AfterViewInit {


  constructor() {}

  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('authElement') authElement: ElementRef;


  stripe: any;  // : stripe.Stripe;
  card: any;
  authenication: any;
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

    const options = { mode: 'shipping' };

    this.authenication = elements.create('address', options);
    this.authenication.mount(this.authElement.nativeElement);

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
