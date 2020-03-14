import { Word } from './word.model';

export class WordSet extends Word {
  constructor(
    id: string,
    en: string,
    ua: string,
    date: Date,
    repeatDates?: { status: boolean, date: Date }[],
    count?: number,
    public isLearn?: boolean,
    public example?: string,
  ) {
    super(id, en, ua, date, repeatDates, count);
  }
}
