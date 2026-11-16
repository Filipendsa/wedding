import { ValueObject } from './ValueObject';
import { Result } from './Result';

interface MoneyProps {
  cents: number;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  static fromReais(amount: number): Result<Money> {
    if (!Number.isFinite(amount) || amount <= 0) {
      return Result.fail('O valor deve ser maior que zero.');
    }
    const cents = Math.round(amount * 100);
    return Result.ok(new Money({ cents }));
  }

  static fromCents(cents: number): Result<Money> {
    if (!Number.isInteger(cents) || cents <= 0) {
      return Result.fail('O valor em centavos deve ser um inteiro positivo.');
    }
    return Result.ok(new Money({ cents }));
  }

  static zero(): Money {
    return new Money({ cents: 0 });
  }

  get cents(): number {
    return this.props.cents;
  }

  get reais(): number {
    return this.props.cents / 100;
  }

  add(other: Money): Money {
    return new Money({ cents: this.props.cents + other.cents });
  }

  divideByInstallments(installments: number): Money {
    const safeCount = Math.max(1, Math.min(12, Math.floor(installments)));
    return new Money({ cents: Math.round(this.props.cents / safeCount) });
  }

  formatBRL(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.reais);
  }
}
