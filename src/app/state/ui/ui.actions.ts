import { Action } from '@ngrx/store';

export const START_LOADING_WORDS = '[UI] Start Loading Words';
export const STOP_LOADING_WORDS = '[UI] Stop Loading Words';

export class StartLoadingWords implements Action {
  readonly type = START_LOADING_WORDS;
}

export class StopLoadingWords implements Action {
  readonly type = STOP_LOADING_WORDS;
}

export type UIActions = StartLoadingWords | StopLoadingWords;
