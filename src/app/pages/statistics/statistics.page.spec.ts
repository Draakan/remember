import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatiscticsPage } from './statistics.page';

describe('Tab3Page', () => {
  let component: StatiscticsPage;
  let fixture: ComponentFixture<StatiscticsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatiscticsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatiscticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
