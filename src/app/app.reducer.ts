import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { uiReducer, getIsLoadingWords, UIState } from './state/ui/ui.reducer';
import { authReducer, getIsAuth, AuthState } from './state/auth/auth.reducer';
import { wordsReducer, getAllWords, WordsState } from './state/words/words.reducer';
import { NetworkState, getIsOnline, networkReducer } from './state/network/network.reducer';

export interface State {
  ui: UIState;
  auth: AuthState;
  words: WordsState;
  network: NetworkState;
}

export const reducers: ActionReducerMap<State> = {
  ui: uiReducer,
  auth: authReducer,
  words: wordsReducer,
  network: networkReducer,
};

const getUiState = createFeatureSelector<UIState>('ui');
export const getIsLoading = createSelector(getUiState, getIsLoadingWords);

const getAuthState = createFeatureSelector<AuthState>('auth');
export const getIsAuthState = createSelector(getAuthState, getIsAuth);

const getWordsState = createFeatureSelector<WordsState>('words');
export const getAllWordsState = createSelector(getWordsState, getAllWords);

const getOnlineState = createFeatureSelector<NetworkState>('network');
export const getIsOnlineState = createSelector(getOnlineState, getIsOnline);
