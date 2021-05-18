export class Ok<T> {
  private readonly _val: T;

  private constructor(val: T) {
    this._val = val;
  }

  static of<K>(val: K) : Ok<K> {
    return new Ok(val);
  }

  value() : T {
    return this._val;
  }
}

export type Result<T, E> = Ok<T> | E;
