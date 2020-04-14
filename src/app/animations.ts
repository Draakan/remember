import { trigger, state, style, transition, animate } from '@angular/animations';

export const Animations = {
  changeVisibilityDictionary: trigger('changeVisibilityDictionary', [
    state('initial', style({
      opacity: 0,
    })),
    state('final', style({
      opacity: 1
    })),
    transition('initial=>final', animate('2000ms ease-in'))
  ]),
  changeVisibilitySearch: trigger('changeVisibilitySearch', [
    state('initial', style({
      opacity: 0,
    })),
    state('final', style({
      opacity: 1
    })),
    transition('initial=>final', animate('4000ms'))
  ]),
  changeVisibilitySpinner: trigger('changeVisibilitySpinner', [
    state('initial', style({
      opacity: 1,
    })),
    state('final', style({
      opacity: 0,
      display: 'none'
    })),
    transition('initial=>final', animate('2000ms'))
  ]),
};
