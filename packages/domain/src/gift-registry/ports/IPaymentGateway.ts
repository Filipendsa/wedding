import { Money } from '../../shared/Money';
import { Result } from '../../shared/Result';
import { CardPaymentDetails } from '../value-objects/CardPaymentDetails';
import { PixBrCode } from '../value-objects/PixBrCode';

export interface PixAuthorizationResult {
  transactionCode: string;
  pixCode: PixBrCode;
}

export interface CardAuthorizationResult {
  transactionCode: string;
  status: 'PAID';
  installments: number;
  cardLast4: string;
  cardBrand: CardPaymentDetails['brand'];
}

export interface IPaymentGateway {
  createPixCharge(input: {
    pixKey: string;
    recipientName: string;
    amount: Money;
  }): Result<PixAuthorizationResult>;

  authorizeCardPayment(input: {
    amount: Money;
    card: CardPaymentDetails;
  }): Promise<Result<CardAuthorizationResult>>;
}
