import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WordItemComponent } from './word-item.component';

describe('WordItemComponent', () => {
  let component: WordItemComponent;
  let fixture: ComponentFixture<WordItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WordItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
