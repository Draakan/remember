export class Word {
  constructor(
    public id: string,
    public en: string,
    public ua: string,
    public date: Date,
    public repeatDates?: { status: boolean, date: Date }[],
    public count?: number,
  ) { }
}
