import { AggregateRoot } from '../../shared/AggregateRoot';
import { Money } from '../../shared/Money';
import { Result } from '../../shared/Result';
import { GuestName } from '../../guest-portal/value-objects/GuestName';
import { CardBrand } from '../value-objects/CardPaymentDetails';

export type PaymentMethod = 'PIX' | 'CREDIT_CARD';
export type ContributionStatus = 'PENDING' | 'PAID';

export interface GiftContributionProps {
  giftId: string;
  giftTitle: string;
  giftIcon: string;
  donorName: GuestName;
  amount: Money;
  paymentMethod: PaymentMethod;
  status: ContributionStatus;
  installments: number;
  cardLast4?: string;
  cardBrand?: CardBrand;
  pixPayload?: string;
  transactionCode: string;
  message?: string;
  createdAt: number;
}

export interface GiftContributionPrimitives {
  id: string;
  giftId: string;
  giftTitle: string;
  giftIcon: string;
  donorName: string;
  amountReais: number;
  formattedAmount: string;
  paymentMethod: PaymentMethod;
  status: ContributionStatus;
  installments: number;
  cardLast4?: string;
  cardBrand?: CardBrand;
  pixPayload?: string;
  transactionCode: string;
  message?: string;
  createdAt: number;
}

export class GiftContribution extends AggregateRoot<GiftContributionProps> {
  private constructor(props: GiftContributionProps, id?: string) {
    super(props, id);
  }

  static create(input: {
    giftId: string;
    giftTitle: string;
    giftIcon: string;
    donorName: string;
    amount: Money;
    paymentMethod: PaymentMethod;
    status: ContributionStatus;
    installments?: number;
    cardLast4?: string;
    cardBrand?: CardBrand;
    pixPayload?: string;
    transactionCode: string;
    message?: string;
  }): Result<GiftContribution> {
    const donorResult = GuestName.create(input.donorName);
    if (donorResult.isFailure) {
      return Result.fail(donorResult.getError());
    }

    const now = Date.now();
    const contribution = new GiftContribution({
      giftId: input.giftId,
      giftTitle: input.giftTitle,
      giftIcon: input.giftIcon,
      donorName: donorResult.getValue(),
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      status: input.status,
      installments: input.installments ?? 1,
      cardLast4: input.cardLast4,
      cardBrand: input.cardBrand,
      pixPayload: input.pixPayload,
      transactionCode: input.transactionCode,
      message: input.message?.trim() || undefined,
      createdAt: now,
    });

    contribution.addDomainEvent({
      eventName: 'GiftContributionCreated',
      occurredOn: new Date(now),
      aggregateId: contribution.id,
    });

    return Result.ok(contribution);
  }

  static restore(data: {
    id: string;
    giftId: string;
    giftTitle: string;
    giftIcon: string;
    donorName: string;
    amountReais: number;
    paymentMethod: PaymentMethod;
    status: ContributionStatus;
    installments: number;
    cardLast4?: string;
    cardBrand?: CardBrand;
    pixPayload?: string;
    transactionCode: string;
    message?: string;
    createdAt: number;
  }): Result<GiftContribution> {
    const donorResult = GuestName.create(data.donorName);
    const amountResult = Money.fromReais(data.amountReais);
    if (donorResult.isFailure || amountResult.isFailure) {
      return Result.fail('Dados inválidos ao restaurar doação de presente.');
    }

    return Result.ok(
      new GiftContribution(
        {
          giftId: data.giftId,
          giftTitle: data.giftTitle,
          giftIcon: data.giftIcon,
          donorName: donorResult.getValue(),
          amount: amountResult.getValue(),
          paymentMethod: data.paymentMethod,
          status: data.status,
          installments: data.installments,
          cardLast4: data.cardLast4,
          cardBrand: data.cardBrand,
          pixPayload: data.pixPayload,
          transactionCode: data.transactionCode,
          message: data.message,
          createdAt: data.createdAt,
        },
        data.id
      )
    );
  }

  get amount(): Money {
    return this.props.amount;
  }

  markAsPaid(): void {
    this.props = {
      ...this.props,
      status: 'PAID',
    };
  }

  toPrimitives(): GiftContributionPrimitives {
    return {
      id: this._id,
      giftId: this.props.giftId,
      giftTitle: this.props.giftTitle,
      giftIcon: this.props.giftIcon,
      donorName: this.props.donorName.value,
      amountReais: this.props.amount.reais,
      formattedAmount: this.props.amount.formatBRL(),
      paymentMethod: this.props.paymentMethod,
      status: this.props.status,
      installments: this.props.installments,
      cardLast4: this.props.cardLast4,
      cardBrand: this.props.cardBrand,
      pixPayload: this.props.pixPayload,
      transactionCode: this.props.transactionCode,
      message: this.props.message,
      createdAt: this.props.createdAt,
    };
  }
}
