export class Iterable {
  *[Symbol.iterator]() {
    for (const [key, value] of Object.entries(this)) {
      yield { key, value };
    }
  }
}
