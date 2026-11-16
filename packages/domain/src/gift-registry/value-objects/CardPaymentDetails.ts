import { ValueObject } from '../../shared/ValueObject';
import { Result } from '../../shared/Result';

export type CardBrand = 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'CARTAO';

interface CardPaymentDetailsProps {
  holderName: string;
  last4: string;
  brand: CardBrand;
  expiry: string;
  installments: number;
}

function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'MASTERCARD';
  if (/^3[47]/.test(digits)) return 'AMEX';
  if (/^(4011|4312|4389|5041|5066|5090|6277|6362|6363|650|651|655)/.test(digits)) {
    return 'ELO';
  }
  return 'CARTAO';
}

export class CardPaymentDetails extends ValueObject<CardPaymentDetailsProps> {
  static readonly MAX_INSTALLMENTS = 6;

  private constructor(props: CardPaymentDetailsProps) {
    super(props);
  }

  static create(input: {
    holderName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    installments: number;
  }): Result<CardPaymentDetails> {
    const holder = input.holderName.trim();
    if (holder.length < 3) {
      return Result.fail('Informe o nome impresso no cartão.');
    }

    const digits = input.cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) {
      return Result.fail('Número do cartão inválido (deve conter entre 13 e 19 dígitos).');
    }

    const expiryMatch = input.expiry.trim().match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
      return Result.fail('Informe a validade do cartão no formato MM/AA.');
    }

    const month = parseInt(expiryMatch[1], 10);
    const year = 2000 + parseInt(expiryMatch[2], 10);
    if (month < 1 || month > 12) {
      return Result.fail('Mês de validade do cartão inválido.');
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return Result.fail('Este cartão está com a validade expirada.');
    }

    const cvvDigits = input.cvv.replace(/\D/g, '');
    if (cvvDigits.length < 3 || cvvDigits.length > 4) {
      return Result.fail('Informe um código de segurança (CVV) válido.');
    }

    if (
      !Number.isInteger(input.installments) ||
      input.installments < 1 ||
      input.installments > CardPaymentDetails.MAX_INSTALLMENTS
    ) {
      return Result.fail(
        `O parcelamento deve ser entre 1x e ${CardPaymentDetails.MAX_INSTALLMENTS}x.`
      );
    }

    return Result.ok(
      new CardPaymentDetails({
        holderName: holder.toUpperCase(),
        last4: digits.slice(-4),
        brand: detectBrand(digits),
        expiry: input.expiry.trim(),
        installments: input.installments,
      })
    );
  }

  get holderName(): string {
    return this.props.holderName;
  }

  get last4(): string {
    return this.props.last4;
  }

  get brand(): CardBrand {
    return this.props.brand;
  }

  get installments(): number {
    return this.props.installments;
  }
}
