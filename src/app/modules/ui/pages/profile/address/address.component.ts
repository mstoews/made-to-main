import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileModel } from 'app/models/profile';
import { first, from, map, Observable, OperatorFunction } from 'rxjs';
import { MaterialModule } from 'app/material.module';
import { ProfileService } from 'app/services/profile.service';
import { AuthService } from 'app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/services/auth/user.service';

@Component({
  standalone: true,
  selector: 'app-address',
  templateUrl: './address.component.html',
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddressComponent implements OnInit {
  profile: ProfileModel;
  profile$: Observable<ProfileModel[]>;
  formGroup: FormGroup;
  profileExists: boolean;
  updateBtnState: boolean = false;
  userId: string;
  email: string;
  profileId: string;

  address: ProfileModel = {
    id: '',
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    province_state: '',
    postal_code: '',
    phone_number: '',
    country: '',
    created_date: '',
    userId: '',
  };

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public userService: UserService,
    public profileService: ProfileService,
    public snack: MatSnackBar
  ) {
    const theDate = new Date();
    this.createForm(this.address);
    this.updateBtnState = false;
  }

  ngOnInit() {
    this.profileExists = false;
    this.authService.getUserId().then((userId) => {
      this.userId = userId;
      this.email = this.authService.email;
      // this.profileService.getUserProfile(this.userId).subscribe((data) => {
      //   this.createForm(data[0]);
      // });
    });
  }

  onUpdateProfile() {
    let data = this.formGroup.getRawValue();
    this.updateBtnState = true;

    if (this.profileExists === true) {
      this.profileService.update(data);
      this.snack.open('Profile has been updated ...', 'OK', {
        duration: 3000,
      });
    }
    this.updateBtnState = false;
  }
  //   this.authService.getUserId()
  //     .then((user) => {
  //       //const collectionRef = this.afs.collection(`users/${user.uid}/profile/`);
  //       this.profileCollection
  //         .add(data)
  //         .then((newProfile) => {
  //           data.id = newProfile.id;
  //           this.profileCollection.doc(data.id).update(data);
  //         })
  //         .catch()
  //         .finally();
  //       this.snack.open('Profile has been add ...', 'OK', {
  //         verticalPosition: 'top',
  //         horizontalPosition: 'right',
  //         panelClass: 'bg-danger',
  //       });
  //     })
  //     .then()
  //     .catch((error) => {
  //       console.error('Error writing document: ', error);
  //     });
  // } else {
  //   this.authService.getUserId()
  //     .then((userId) => {
  //       const collectionRef = this.afs.collection(
  //         `users/${userId}/profile/`
  //       );
  //       data.id = this.profileId;
  //       collectionRef.doc(this.profileId).update(data);
  //       this.snack.open('Profile has been updated ...', 'OK', {
  //         duration: 3000,
  //       });
  //       this.updateStripeCustomerId(userId);
  //       console.debug('user doc', this.updateStripeCustomerId(userId));
  //     })
  //     .catch((error) => {
  //       console.error('Error writing document: ', error);
  //     });

  updateStripeCustomerId(userId: string) {
    // this.afs
    //   .collection(`/users/{$userId}/stripe`)
    //   .get()
    //   .pipe(
    //     map((result) => {
    //       return result.docs.map((snap) => {
    //         return {
    //           id: snap.id,
    //           ...(<any>snap.data()),
    //         };
    //       });
    //     })
    //   );
    /* MARK check whether we should save the stripe customer information */
  }

  createForm(profile: ProfileModel) {
    const theDate = new Date();
    this.formGroup = this.fb.group({
      email: [profile.email, Validators.required],
      first_name: [profile.first_name, Validators.required],
      last_name: [profile.last_name, Validators.required],
      middle_name: [profile.middle_name],
      address_line1: [profile.address_line1, Validators.required],
      address_line2: [profile.address_line2, Validators.required],
      city: [profile.city, Validators.required],
      province_state: [profile.province_state, Validators.required],
      postal_code: [profile.postal_code, Validators.required],
      country: [profile.country, Validators.required],
      phone_number: [profile.phone_number, Validators.required],
      created_date: theDate.toDateString(),
      userId: this.userId,
    });
  }
}
