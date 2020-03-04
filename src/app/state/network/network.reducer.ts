import { networkActions, SET_ONLINE, SET_OFFLINE } from './network.actions';

export interface NetworkState {
  isOnline: boolean;
}

const initialState: NetworkState = {
    isOnline: true
};

export function networkReducer(state = initialState, action: networkActions) {
  switch (action.type) {
    case SET_ONLINE:
      return {
        isOnline: true
      };
    case SET_OFFLINE:
      return {
        isOnline: false
      };
    default: {
      return state;
    }
  }
}

export const getIsOnline = (state: NetworkState) => state.isOnline;
