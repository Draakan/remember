import { UIActions, START_LOADING_WORDS, STOP_LOADING_WORDS } from './ui.actions';

export interface UIState {
  isLoadingWords: boolean;
}

const initialState: UIState = {
  isLoadingWords: false
};

export function uiReducer(state = initialState, action: UIActions) {
  switch (action.type) {
    case START_LOADING_WORDS:
      return {
        isLoadingWords: true
      };
    case STOP_LOADING_WORDS:
      return {
        isLoadingWords: false
      };
    default: {
      return state;
    }
  }
}

export const getIsLoadingWords = (state: UIState) => state.isLoadingWords;
