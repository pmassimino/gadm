import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasSettingListComponent } from './ventas-setting-list.component';

describe('VentasSettingListComponent', () => {
  let component: VentasSettingListComponent;
  let fixture: ComponentFixture<VentasSettingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasSettingListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentasSettingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
