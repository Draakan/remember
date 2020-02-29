import { WordsActions, SET_ALL_WORDS, CREATE_WORD, UPDATE_WORD, DELETE_WORD } from './words.actions';
import { Group } from 'src/app/models/group.model';

export interface WordsState {
  groupedWords: Group[];
}

const initialState: WordsState = {
  groupedWords: []
};

export function wordsReducer(state = initialState, action: WordsActions) {
  switch (action.type) {
    case SET_ALL_WORDS:
      return {
        groupedWords: action.payload
      };
    case CREATE_WORD: {
      const head = state.groupedWords[0];
      const newWord = action.payload;

      if (state.groupedWords.length &&
          newWord.date.getDay() === new Date(head.date).getDay() &&
          newWord.date.getMonth() === new Date(head.date).getMonth()) {

        head.words = [...head.words, newWord];

        return {
          groupedWords: [
            ...state.groupedWords.slice(0, 0),
            head,
            ...state.groupedWords.slice(1)
          ]
        };
      } else {
        return {
          groupedWords: [
            new Group(new Date().toString(), [newWord]),
            ...state.groupedWords
          ]
        };
      }
    }
    case UPDATE_WORD: {
      const { word, groupIndex, itemIndex } = action.payload;

      const group = state.groupedWords[groupIndex];

      group.words = [
        ...group.words.slice(0, itemIndex),
        word,
        ...group.words.slice(itemIndex + 1),
      ];

      return {
        groupedWords: [
          ...state.groupedWords.slice(0, groupIndex),
          group,
          ...state.groupedWords.slice(groupIndex + 1)
        ]
      };
    }
    case DELETE_WORD: {
      const { groupIndex, itemIndex } = action.payload;

      const group = state.groupedWords[groupIndex];

      group.words = [
        ...group.words.slice(0, itemIndex),
        ...group.words.slice(itemIndex + 1),
      ];

      if (group.words.length === 0) {
        return {
          groupedWords: [
            ...state.groupedWords.slice(0, groupIndex),
            ...state.groupedWords.slice(groupIndex + 1)
          ]
        };
      }

      return {
        groupedWords: [
          ...state.groupedWords.slice(0, groupIndex),
          group,
          ...state.groupedWords.slice(groupIndex + 1)
        ]
      };
    }
    default: {
      return state;
    }
  }
}

export const getAllWords = (state: WordsState) => state.groupedWords;
