import { Word } from './word.model';

export class Group {
  constructor(
    public date: string,
    public words: Word[]
  ) { }
}
