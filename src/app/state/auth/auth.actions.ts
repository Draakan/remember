import { Action } from '@ngrx/store';

export const SET_LOGOUTED = '[Auth] Set Logouted';
export const SET_LOGINED = '[Auth] Set Logined';

export class SetLogouted implements Action {
  readonly type = SET_LOGOUTED;
}

export class SetLogined implements Action {
  readonly type = SET_LOGINED;
}

export type AuthActions = SetLogouted | SetLogined;
