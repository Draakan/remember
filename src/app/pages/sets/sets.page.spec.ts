import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetsPage } from './sets.page';

describe('SetsPage', () => {
  let component: SetsPage;
  let fixture: ComponentFixture<SetsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
