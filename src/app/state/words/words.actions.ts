import { Action } from '@ngrx/store';
import { Group } from 'src/app/models/group.model';
import { Word } from 'src/app/models/word.model';

export const SET_ALL_WORDS = '[WORDS] Set All Words';
export const CREATE_WORD = '[WORDS] Create Word';
export const UPDATE_WORD = '[WORDS] Update Word';
export const DELETE_WORD = '[WORDS] Delete Word';

export class PayloadData {
  constructor(
    public groupIndex: number,
    public itemIndex: number,
    public word?: Word
  ) {}
}

export class SetAllWords implements Action {
  readonly type = SET_ALL_WORDS;

  constructor(public payload: Group[]) {}
}

export class CreateWord implements Action {
  readonly type = CREATE_WORD;

  constructor(public payload: Word) {}
}

export class UpdateWord implements Action {
  readonly type = UPDATE_WORD;

  constructor(public payload: PayloadData) {}
}

export class DeleteWord implements Action {
  readonly type = DELETE_WORD;

  constructor(public payload: PayloadData) {}
}

export type WordsActions = SetAllWords | CreateWord | UpdateWord | DeleteWord;
