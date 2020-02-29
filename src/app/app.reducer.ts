import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { uiReducer, getIsLoadingWords, UIState } from './state/ui/ui.reducer';
import { authReducer, getIsAuth, AuthState } from './state/auth/auth.reducer';
import { wordsReducer, getAllWords, WordsState } from './state/words/words.reducer';

export interface State {
  ui: UIState;
  auth: AuthState;
  words: WordsState;
}

export const reducers: ActionReducerMap<State> = {
  ui: uiReducer,
  auth: authReducer,
  words: wordsReducer,
};

const getUiState = createFeatureSelector<UIState>('ui');
export const getIsLoading = createSelector(getUiState, getIsLoadingWords);

const getAuthState = createFeatureSelector<AuthState>('auth');
export const getIsAuthState = createSelector(getAuthState, getIsAuth);

const getWordsState = createFeatureSelector<WordsState>('words');
export const getAllWordsState = createSelector(getWordsState, getAllWords);
