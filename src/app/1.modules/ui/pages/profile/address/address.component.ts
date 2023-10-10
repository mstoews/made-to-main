import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileModel } from 'app/5.models/profile';
import { first, from, map, Observable, OperatorFunction } from 'rxjs';
import { MaterialModule } from 'app/material.module';
import { ProfileService } from 'app/4.services/profile.service';
import { AuthService } from 'app/4.services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { UserService } from 'app/4.services/auth/user.service';

@Component({
  standalone: true,
  selector: 'app-address',
  templateUrl: './address.component.html',
  imports: [MaterialModule],
})
export class AddressComponent implements OnInit {
  profile: ProfileModel;
  profile$: Observable<ProfileModel[]>;
  formGroup: FormGroup;
  profileExists: boolean;
  private profileCollection: AngularFirestoreCollection<ProfileModel>;
  private profileItems: Observable<ProfileModel[]>;

  updateBtnState: boolean = false;
  userId: string;
  email: string;
  profileId: string;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public userService: UserService,
    public afs: AngularFirestore,
    public profileService: ProfileService,
    public snack: MatSnackBar
  ) {
    this.profileCollection = afs.collection<ProfileModel>(
      `users/${this.authService.userId}/profile`
    );
    this.profileItems = this.profileCollection.valueChanges({ idField: 'id' });

    const theDate = new Date();
    const address: ProfileModel = {
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
      created_date: theDate.toDateString(),
      userId: this.userId,
    };
    this.createForm(address);
    this.updateBtnState = false;
  }

  ngOnInit() {
    this.profileExists = false;
    this.authService.getUserId().then((userId) => {
      this.userId = userId;
      this.email = this.authService.email;
    });

      let collection = this.afs.collection<ProfileModel>(
        `users/${this.userId}/profile`
      );
      const profiles = collection.valueChanges({ idField: 'id' });

      console.debug('ngOnInit', this.userId);

      // return only the first element of document which constains the only profile for the user ID if it exists.

      profiles.pipe(first()).subscribe((ref) => {
        if (ref.length > 0) {
          this.profileExists = true;
          // console.debug('The profile exists for this user!');
          ref.forEach((mr) => {
            this.profileId = mr.id;
            this.createForm(mr);
          });
        }
      });
    }
  
  onUpdateProfile() {
    let data = this.formGroup.getRawValue();
    this.updateBtnState = true;

    if (this.profileExists === false) {
      this.authService.getUserId()
        .then((user) => {
          //const collectionRef = this.afs.collection(`users/${user.uid}/profile/`);
          this.profileCollection
            .add(data)
            .then((newProfile) => {
              data.id = newProfile.id;
              this.profileCollection.doc(data.id).update(data);
            })
            .catch()
            .finally();
          this.snack.open('Profile has been add ...', 'OK', {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
          });
        })
        .then()
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    } else {
      this.authService.getUserId()
        .then((userId) => {
          const collectionRef = this.afs.collection(
            `users/${userId}/profile/`
          );
          data.id = this.profileId;
          collectionRef.doc(this.profileId).update(data);
          this.snack.open('Profile has been updated ...', 'OK', {
            duration: 3000,
          });
          this.updateStripeCustomerId(userId);
          console.debug('user doc', this.updateStripeCustomerId(userId));
        })
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    }
    this.updateBtnState = false;
  }

  updateStripeCustomerId(userId: string) {
    this.afs
      .collection(`/users/{$userId}/stripe`)
      .get()
      .pipe(
        map((result) => {
          return result.docs.map((snap) => {
            return {
              id: snap.id,
              ...(<any>snap.data()),
            };
          });
        })
      );
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
