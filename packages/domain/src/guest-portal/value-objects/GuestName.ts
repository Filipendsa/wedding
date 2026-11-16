import { ValueObject } from '../../shared/ValueObject';
import { Result } from '../../shared/Result';

interface GuestNameProps {
  value: string;
}

export class GuestName extends ValueObject<GuestNameProps> {
  private constructor(props: GuestNameProps) {
    super(props);
  }

  static create(raw: string): Result<GuestName> {
    const normalized = raw.trim().replace(/\s+/g, ' ');
    if (normalized.length < 2) {
      return Result.fail('Por favor, informe um nome com pelo menos 2 letras.');
    }
    if (normalized.length > 80) {
      return Result.fail('O nome deve ter no máximo 80 caracteres.');
    }
    return Result.ok(new GuestName({ value: normalized }));
  }

  get value(): string {
    return this.props.value;
  }

  get firstName(): string {
    return this.props.value.split(' ')[0] || this.props.value;
  }

  get initials(): string {
    const parts = this.props.value.split(' ').filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
}
