import { Component, Input, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of }  from 'rxjs';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.css']
})
export class PurchaseDetailComponent implements OnInit {
  purchases: any[] = [];
  @Input() key: string;

  firestore = inject(Firestore);
  route = inject(Router);
  purchases$: Observable<any[]>;
  details$: Observable<any[]>;


  constructor() { }

  ngOnInit(): void {
    // Initialization code goes here
    console.debug(`key: ${this.key}`)
    this.getProductsByID(this.key);
  }

  getProductsByID(key: string)  {
    // this.purchases$ = collectionData( query(collection(this.firestore, 'purchases'),
    // where('id', '==', this.key) ,
    // orderBy('date_updated')),
    // { idField: 'id' } ) as Observable<any[]>;

    this.purchases$ = collectionData( query(collection(this.firestore, 'purchases'), orderBy('date_updated')),   { idField: 'id' } ) as Observable<any[]>;

    this.purchases$.subscribe((data) => {
      data.forEach((item) => {
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            if (item[key].hasOwnProperty('brand')) {
              const purchase_item = {
                id: item[key].product_id,
                short_description: item[key].short_description,
                brand: item[key].brand,
                category: item[key].category,
                description: item[key].description,
                image: item[key].image,
                name: item[key].name,
                price: item[key].price,
                quantity: item[key].quantity,
                height : item[key].height,
                bust : item[key].bust,
                waist : item[key].waist,
                hip : item[key].hip,
                inseam: item[key].inseam,
                outseam: item[key].outseam,
                sleeve_length: item[key].sleeve_length,
                status: item[key].status,
                date_updated: item[key].date_updated,
                date_created: item[key].date_created,
              }
              this.purchases.push(purchase_item);
            }
          }
        }
      });
    });
  }

  onCellDoublClicked(e) {
    this.route.navigate(['admin/inventory', e.data.id]);
  }


}
