import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMaintenanceComponent } from './image-maintenance.component';

describe('ImageMaintenanceComponent', () => {
  let component: ImageMaintenanceComponent;
  let fixture: ComponentFixture<ImageMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
