export class Result<T, E = string> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _error?: E;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._error = error;
    this._value = value;
  }

  static ok<U, F = string>(value: U): Result<U, F> {
    return new Result<U, F>(true, undefined, value);
  }

  static fail<U = never, F = string>(error: F): Result<U, F> {
    return new Result<U, F>(false, error);
  }

  getValue(): T {
    if (!this.isSuccess || this._value === undefined) {
      throw new Error('Cannot extract value from a failed Result.');
    }
    return this._value;
  }

  getError(): E {
    if (this.isSuccess || this._error === undefined) {
      throw new Error('Cannot extract error from a successful Result.');
    }
    return this._error;
  }
}
