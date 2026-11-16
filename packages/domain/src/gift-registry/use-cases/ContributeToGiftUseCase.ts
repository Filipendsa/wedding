import { Money } from '../../shared/Money';
import { Result } from '../../shared/Result';
import {
  GiftContribution,
  GiftContributionPrimitives,
  PaymentMethod,
} from '../entities/GiftContribution';
import { CardPaymentDetails } from '../value-objects/CardPaymentDetails';
import { IGiftRepository } from '../ports/IGiftRepository';
import { IPaymentGateway } from '../ports/IPaymentGateway';

export interface ContributeToGiftInput {
  giftId: string;
  giftTitle: string;
  giftIcon: string;
  donorName: string;
  amountReais: number;
  paymentMethod: PaymentMethod;
  message?: string;
  pixConfig?: {
    pixKey: string;
    recipientName: string;
  };
  cardInput?: {
    holderName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    installments: number;
  };
}

export class ContributeToGiftUseCase {
  constructor(
    private readonly giftRepository: IGiftRepository,
    private readonly paymentGateway: IPaymentGateway
  ) {}

  async execute(input: ContributeToGiftInput): Promise<Result<GiftContributionPrimitives>> {
    const moneyResult = Money.fromReais(input.amountReais);
    if (moneyResult.isFailure) {
      return Result.fail(moneyResult.getError());
    }
    const amount = moneyResult.getValue();

    if (input.paymentMethod === 'PIX') {
      if (!input.pixConfig) {
        return Result.fail('Configuração PIX não informada.');
      }

      const pixResult = this.paymentGateway.createPixCharge({
        pixKey: input.pixConfig.pixKey,
        recipientName: input.pixConfig.recipientName,
        amount,
      });

      if (pixResult.isFailure) {
        return Result.fail(pixResult.getError());
      }

      const pixCharge = pixResult.getValue();
      const contributionResult = GiftContribution.create({
        giftId: input.giftId,
        giftTitle: input.giftTitle,
        giftIcon: input.giftIcon,
        donorName: input.donorName,
        amount,
        paymentMethod: 'PIX',
        status: 'PAID',
        pixPayload: pixCharge.pixCode.payload,
        transactionCode: pixCharge.transactionCode,
        message: input.message,
      });

      if (contributionResult.isFailure) {
        return Result.fail(contributionResult.getError());
      }

      const contribution = contributionResult.getValue();
      await this.giftRepository.saveContribution(contribution);
      return Result.ok(contribution.toPrimitives());
    }

    // CREDIT_CARD flow
    if (!input.cardInput) {
      return Result.fail('Dados do cartão não informados.');
    }

    const cardDetailsResult = CardPaymentDetails.create(input.cardInput);
    if (cardDetailsResult.isFailure) {
      return Result.fail(cardDetailsResult.getError());
    }

    const cardAuthResult = await this.paymentGateway.authorizeCardPayment({
      amount,
      card: cardDetailsResult.getValue(),
    });

    if (cardAuthResult.isFailure) {
      return Result.fail(cardAuthResult.getError());
    }

    const auth = cardAuthResult.getValue();
    const contributionResult = GiftContribution.create({
      giftId: input.giftId,
      giftTitle: input.giftTitle,
      giftIcon: input.giftIcon,
      donorName: input.donorName,
      amount,
      paymentMethod: 'CREDIT_CARD',
      status: auth.status,
      installments: auth.installments,
      cardLast4: auth.cardLast4,
      cardBrand: auth.cardBrand,
      transactionCode: auth.transactionCode,
      message: input.message,
    });

    if (contributionResult.isFailure) {
      return Result.fail(contributionResult.getError());
    }

    const contribution = contributionResult.getValue();
    await this.giftRepository.saveContribution(contribution);
    return Result.ok(contribution.toPrimitives());
  }
}
