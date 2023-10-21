import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { IImageMaintenance, IImageStorage } from 'app/models/maintenance';

@Injectable({
  providedIn: 'root',
})
export class ImageMaintenanceService {
  getAll() {
    // console.debug(`Images ${this.inventoryItems}`);
  }

  get(id: string) {}

  create(mtImage: IImageMaintenance) {}

  createImageFirebaseInput(mtImageStorage: IImageStorage) {
    // console.debug(mtImageStorage);
  }

  getImageFile(id: string) {}

  update(mtImage: IImageMaintenance) {}

  delete(id: string) {}
}
