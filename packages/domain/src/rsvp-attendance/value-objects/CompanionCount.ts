import { ValueObject } from '../../shared/ValueObject';
import { Result } from '../../shared/Result';

interface CompanionCountProps {
  value: number;
}

export class CompanionCount extends ValueObject<CompanionCountProps> {
  static readonly MAX_COMPANIONS = 5;

  private constructor(props: CompanionCountProps) {
    super(props);
  }

  static create(count: number): Result<CompanionCount> {
    if (!Number.isInteger(count) || count < 0 || count > CompanionCount.MAX_COMPANIONS) {
      return Result.fail(
        `A quantidade de acompanhantes deve estar entre 0 e ${CompanionCount.MAX_COMPANIONS}.`
      );
    }
    return Result.ok(new CompanionCount({ value: count }));
  }

  static zero(): CompanionCount {
    return new CompanionCount({ value: 0 });
  }

  get value(): number {
    return this.props.value;
  }
}
