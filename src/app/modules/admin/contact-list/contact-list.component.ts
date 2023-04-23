import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Contact } from 'app/models/contact';
import { ContactService } from 'app/services/contact.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
 

  constructor(
  
    public contactService: ContactService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.onRefresh();
  }
  
  
  onAdd() {
    throw new Error('Method not implemented.');
  }
  valueChangedEvent($event: any) {
    throw new Error('Method not implemented.');
  }
  allContact$: Observable<Contact[]>;

  onRefresh() {
    this.allContact$ = this.contactService.getAll();
    this.allContact$.subscribe((contact) => {
      // console.log(JSON.stringify(contact));
    });
  }

  columnsToDisplay: string[] = ['name', 'email', 'message', 'created_date'];

  onOpenRow(data: any) {}
}