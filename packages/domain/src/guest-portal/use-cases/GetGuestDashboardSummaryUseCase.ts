import { GuestPrimitives } from '../entities/Guest';
import { IGuestReader } from '../ports/IGuestRepository';
import { AttendanceConfirmationPrimitives } from '../../rsvp-attendance/entities/AttendanceConfirmation';
import { IRsvpReader } from '../../rsvp-attendance/ports/IRsvpRepository';
import { GiftContributionPrimitives } from '../../gift-registry/entities/GiftContribution';
import { IGiftContributionReader } from '../../gift-registry/ports/IGiftRepository';
import { Money } from '../../shared/Money';

export interface GuestDashboardSummary {
  guest: GuestPrimitives | null;
  rsvp: AttendanceConfirmationPrimitives | null;
  contributions: GiftContributionPrimitives[];
  totalGiftedFormatted: string;
  totalGiftedReais: number;
}

export class GetGuestDashboardSummaryUseCase {
  constructor(
    private readonly guestReader: IGuestReader,
    private readonly rsvpReader: IRsvpReader,
    private readonly giftReader: IGiftContributionReader
  ) {}

  async execute(): Promise<GuestDashboardSummary> {
    const [guest, rsvp, contributions] = await Promise.all([
      this.guestReader.getCurrentGuest(),
      this.rsvpReader.getLatestConfirmation(),
      this.giftReader.listContributions(),
    ]);

    const totalMoney = contributions.reduce(
      (acc, item) => acc.add(item.amount),
      Money.zero()
    );

    return {
      guest: guest ? guest.toPrimitives() : null,
      rsvp: rsvp ? rsvp.toPrimitives() : null,
      contributions: contributions
        .map((c) => c.toPrimitives())
        .sort((a, b) => b.createdAt - a.createdAt),
      totalGiftedFormatted: totalMoney.formatBRL(),
      totalGiftedReais: totalMoney.reais,
    };
  }
}
