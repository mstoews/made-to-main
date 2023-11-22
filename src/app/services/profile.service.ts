import { inject, Injectable, OnInit } from '@angular/core';
import { async, first, from, map, Observable } from 'rxjs';
import { ProfileModel } from 'app/models/profile';
import { AuthService } from './auth/auth.service';
import { convertSnaps } from './db-utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Blog } from '../models/blog';
import { Mainpage } from '../models/mainpage';
import { Auth, updateProfile } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class ProfileService implements OnInit {
  private profileItems: Observable<ProfileModel[]>;
  private userId: string = '';
  private email: string = '';
  private userName: string = '';

  firestore = inject(Firestore);
  auth = inject(Auth);
  snack = inject(MatSnackBar);

  ngOnInit(): void {

  }

  setUserDisplayName(name: string) {
     this.auth.onAuthStateChanged((user) => {
        updateProfile(user, { displayName: name });
     });
  }

  getUserProfile(userId: string): Observable<ProfileModel[]> {
    const collectionRef = collection(this.firestore, `users/${userId}/profile`);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<ProfileModel[] >;
  }

  getUserCountry(userId: string): string {
    let country: string;
    this.getUserProfile(userId)
      .pipe(first())
      .subscribe((data) => {
        country = data[0].country;
      });
    return country;
  }

  getUserEmail(): string {
    return this.email;
  }

  async getUserFirstName(userId: string): Promise<string> {
    let rc: string;
    this.getUserProfile(userId)
      .pipe(first())
      .subscribe((data) => {
        rc = data[0].first_name;
      });
    return rc;
  }

  async getUserLastName(userId: string): Promise<string> {
    let rc: string;
    await this.getUserProfile(userId)
      .pipe(first())
      .subscribe((data) => {
        rc = data[0].last_name;
      });
    return rc;
  }

  async getUserName(userId: string): Promise<string> {
    return await this.getUserName(userId) + ' ' + await this.getUserLastName(userId);
  }

  update(profile: ProfileModel) {

    // var userName = profile.first_name + ' ' + profile.last_name;

    const ref = doc(
      this.firestore,
      'profile',
      profile.id
    ) as DocumentReference<ProfileModel>;
    updateDoc(ref, profile)
      .then(() => {
        this.snack.open(
          'Profile address has been updated to your profile ...',
          'OK',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
          }
        );
      })
      .catch((error) => {
        this.snack.open(
          'Profile address was NOT updated to your profile ...',
          'OK',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
          }
        );
      })
      .finally();
  }

  async add(userId: string, profile: ProfileModel) {
    try {
      const profile_1 = await addDoc(
        collection(this.firestore, 'profile'),
        profile
      );
      this.snack.open(
        'Profile address has been updated to your profile ...',
        'OK',
        {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
        }
      );
    } catch (error) {
      this.snack.open('Error adding new profile definition ... ', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
    }
  }

  delete(id: string) {
    const ref = doc(this.firestore, 'profile', id);
    deleteDoc(ref);
  }
}
