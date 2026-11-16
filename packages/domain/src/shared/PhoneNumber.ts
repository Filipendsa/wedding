import { ValueObject } from './ValueObject';
import { Result } from './Result';

interface PhoneNumberProps {
  digits: string;
}

export class PhoneNumber extends ValueObject<PhoneNumberProps> {
  private constructor(props: PhoneNumberProps) {
    super(props);
  }

  static create(raw: string): Result<PhoneNumber> {
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      return Result.fail('Informe um telefone/WhatsApp válido com DDD (10 ou 11 dígitos).');
    }
    return Result.ok(new PhoneNumber({ digits }));
  }

  get digits(): string {
    return this.props.digits;
  }

  format(): string {
    const d = this.props.digits;
    if (d.length === 11) {
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
}
