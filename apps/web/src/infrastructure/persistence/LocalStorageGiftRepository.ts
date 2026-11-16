import {
  CardBrand,
  ContributionStatus,
  GiftContribution,
  IGiftRepository,
  PaymentMethod,
} from '@wending/domain';

const STORAGE_KEY = 'wending_gift_contributions_v2';

interface StoredContribution {
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
}

export class LocalStorageGiftRepository implements IGiftRepository {
  async listContributions(): Promise<GiftContribution[]> {
    if (typeof window === 'undefined') return [];

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      const items = JSON.parse(raw) as StoredContribution[];
      return items
        .map((item) => GiftContribution.restore(item))
        .filter((res) => res.isSuccess)
        .map((res) => res.getValue());
    } catch {
      return [];
    }
  }

  async saveContribution(contribution: GiftContribution): Promise<void> {
    if (typeof window === 'undefined') return;

    const current = await this.listContributions();
    const primitivesList = [
      contribution.toPrimitives(),
      ...current.map((item) => item.toPrimitives()),
    ];

    const serialized: StoredContribution[] = primitivesList.map((p) => ({
      id: p.id,
      giftId: p.giftId,
      giftTitle: p.giftTitle,
      giftIcon: p.giftIcon,
      donorName: p.donorName,
      amountReais: p.amountReais,
      paymentMethod: p.paymentMethod,
      status: p.status,
      installments: p.installments,
      cardLast4: p.cardLast4,
      cardBrand: p.cardBrand,
      pixPayload: p.pixPayload,
      transactionCode: p.transactionCode,
      message: p.message,
      createdAt: p.createdAt,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }
}
