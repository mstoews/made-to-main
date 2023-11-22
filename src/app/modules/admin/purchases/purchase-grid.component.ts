import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { filter, Observable, of, Subject, takeUntil } from 'rxjs';
import { ProductsService } from 'app/services/products.service';
import { Product } from 'app/models/products';
import { MatDrawer } from '@angular/material/sidenav';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { IImageStorage } from 'app/models/maintenance';
import { Router } from '@angular/router';

import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'. We recommend that you use the official 'file-saver' package in your applications.
import { exportDataGrid } from 'devextreme/excel_exporter';

import {
  DocumentReference,
  Firestore,
  addDoc,
  and,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';

@Component({
  selector: 'purchase-list',
  templateUrl: './purchase-grid.component.html',
  styleUrls: ['./purchase-grid.component.css'],
})
export class PurchaseComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatDrawer;
  @Input() rich_description: string;
  drawOpen: 'open' | 'close' = 'open';
  prdGroup: FormGroup;
  action: string;
  party: string;
  sTitle: string;
  cPriority: string;
  cRAG: string;
  cType: string;
  currentDate: Date;
  product: Product;
  productId: string;
  current_Url: string;
  updated_category: string;
  selectedItemKeys: string;

  inventoryImages$: Observable<IImageStorage[]>;
  allProducts$: Observable<Product[]>;
  _unsubscribeAll: Subject<any> = new Subject<any>();

  prd: any;

  constructor(
    private matDialog: MatDialog,
    private route: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.sTitle = 'Product Inventory and Images';
    this.onRefresh();
  }

  firestore = inject(Firestore);
  purchases = collectionData( query(collection(this.firestore, 'purchases'), orderBy('date_updated')),   { idField: 'id' } ) as Observable<any[]>;

  onRefresh() {
    this.purchases = collectionData( query(collection(this.firestore, 'purchases'), orderBy('date_updated')),   { idField: 'id' } ) as Observable<any[]>;
  }

  valueChangedEvent($event: Event) {
    console.debug('valueChangedEvent');
  }


  /**
   * The dialogue entry is passed the current entry and parentId which is subsequently
   * passed back so the images collection can be created from the parent inventory item.
   * The parentID must exist before the image collection could be created.
   */

  onExporting(e: { component: any; cancel: boolean }) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          'DataGrid.xlsx'
        );
      });
    });
    e.cancel = true;
  }

  ngOnDestroy(): void {
    if (this._unsubscribeAll) {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }
  }

  // pipe(takeUntil(this._unsubscribeAll))
  onOpenRow(row: any) {
    this.route.navigate(['admin/inventory', row.id]);
  }

  onFocusedRowChanged(e: any) {
    const rowData = e.row && e.row.data;
    // console.debug(`onFocusRowChanged ${JSON.stringify(rowData)}`)
    this.current_Url = rowData.images;
    this.prdGroup.setValue(rowData);
  }

  dateFormatter(params: any) {
    const dateAsString = params.value;
    const dateParts = dateAsString.split('-');
    return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2].slice(0, 2)}`;
  }
}
