import { Action } from '@ngrx/store';

export const SET_ONLINE = '[Network] Set Online';
export const SET_OFFLINE = '[Network] Set Offline';

export class SetOnline implements Action {
  readonly type = SET_ONLINE;
}

export class SetOffline implements Action {
  readonly type = SET_OFFLINE;
}

export type networkActions = SetOnline | SetOffline;
