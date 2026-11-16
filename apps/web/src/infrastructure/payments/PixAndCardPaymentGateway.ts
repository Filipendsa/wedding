import {
  CardAuthorizationResult,
  CardPaymentDetails,
  IPaymentGateway,
  Money,
  PixAuthorizationResult,
  PixBrCode,
  Result,
} from '@wending/domain';
import { WEDDING_DETAILS } from '@wending/utils';

export class PixAndCardPaymentGateway implements IPaymentGateway {
  createPixCharge(input: {
    pixKey: string;
    recipientName: string;
    amount: Money;
  }): Result<PixAuthorizationResult> {
    const txId = `WEND${Date.now().toString(36).toUpperCase()}`;
    const brCodeResult = PixBrCode.generate({
      pixKey: input.pixKey,
      recipientName: input.recipientName,
      city: WEDDING_DETAILS.pixCity,
      amount: input.amount,
      txId,
    });

    if (brCodeResult.isFailure) {
      return Result.fail(brCodeResult.getError());
    }

    return Result.ok({
      transactionCode: txId,
      pixCode: brCodeResult.getValue(),
    });
  }

  async authorizeCardPayment(input: {
    amount: Money;
    card: CardPaymentDetails;
  }): Promise<Result<CardAuthorizationResult>> {
    // Simulated async gateway processing delay
    await new Promise((resolve) => setTimeout(resolve, 650));

    const transactionCode = `CRD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return Result.ok({
      transactionCode,
      status: 'PAID',
      installments: input.card.installments,
      cardLast4: input.card.last4,
      cardBrand: input.card.brand,
    });
  }
}
