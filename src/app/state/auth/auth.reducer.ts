import { AuthActions, SET_LOGOUTED, SET_LOGINED } from './auth.actions';

export interface AuthState {
  isLogouted: boolean;
}

const initialState: AuthState = {
    isLogouted: false
};

export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_LOGOUTED:
      return {
        isLogouted: true
      };
    case SET_LOGINED:
      return {
        isLogouted: false
      };
    default: {
      return state;
    }
  }
}

export const getIsAuth = (state: AuthState) => state.isLogouted;
