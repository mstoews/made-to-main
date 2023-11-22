import { Component } from '@angular/core';
import { ProfileModel } from 'app/models/profile';
import { ProfileService } from 'app/services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css'],
})
export class ProfileListComponent {
  allProfiles$: Observable<ProfileModel[]>;

  constructor(private profileService: ProfileService) {}

  onAdd() {}

  columnsToDisplay: string[] = [
    'id',
    'email',
    'first_name',
    'last_name',
    'middle_name',
    'address_line1',
    'address_line2',
    'city',
    'province_state',
    'postal_code',
    'phone_number',
    'created_date',
    'country',
    'userId?',
  ];
}

/*
<ng-container matColumnDef="id">
          <th class="text-base font-bold text-gray-100 m-2" mat-header-cell *matHeaderCellDef>
            Id
          </th>
          <td mat-cell *matCellDef="let element">
            <img class="m-1 w-30 rounded-lg" [src]="element.id"  priority/>
          </td>
</ng-container>

<ng-container matColumnDef="id">
          <th class="text-base font-bold text-gray-100 m-2" mat-header-cell *matHeaderCellDef>
            Id
          </th>
          <td mat-cell *matCellDef="let element">
            <img class="m-1 w-30 rounded-lg" [src]="element.id"  priority/>
          </td>
</ng-container>
*/

/*
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  address_line1: string;
  address_line2: string;
  city: string;
  province_state: string;
  postal_code: string;
  phone_number: string;
  created_date?: string;
  country: string;
  userId?: string;
*/
