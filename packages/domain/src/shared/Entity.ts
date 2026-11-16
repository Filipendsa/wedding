export abstract class Entity<TProps> {
  protected readonly _id: string;
  protected props: TProps;

  protected constructor(props: TProps, id?: string) {
    this._id = id ?? Entity.generateId();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  equals(object?: Entity<TProps>): boolean {
    if (object === null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!(object instanceof Entity)) {
      return false;
    }
    return this._id === object._id;
  }

  protected static generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
