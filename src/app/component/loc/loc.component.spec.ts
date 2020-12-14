import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocComponent } from './loc.component';

describe('LocComponent', () => {
  let component: LocComponent;
  let fixture: ComponentFixture<LocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
