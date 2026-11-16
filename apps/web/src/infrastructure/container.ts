import {
  ConfirmAttendanceUseCase,
  ContributeToGiftUseCase,
  GetGuestDashboardSummaryUseCase,
  GetGuestRsvpStatusUseCase,
  IdentifyGuestUseCase,
  ListGuestContributionsUseCase,
} from '@wending/domain';
import { LocalStorageGuestRepository } from './persistence/LocalStorageGuestRepository';
import { LocalStorageRsvpRepository } from './persistence/LocalStorageRsvpRepository';
import { LocalStorageGiftRepository } from './persistence/LocalStorageGiftRepository';
import { PixAndCardPaymentGateway } from './payments/PixAndCardPaymentGateway';

const guestRepository = new LocalStorageGuestRepository();
const rsvpRepository = new LocalStorageRsvpRepository();
const giftRepository = new LocalStorageGiftRepository();
const paymentGateway = new PixAndCardPaymentGateway();

export const webContainer = {
  identifyGuestUseCase: new IdentifyGuestUseCase(guestRepository),
  getGuestDashboardSummaryUseCase: new GetGuestDashboardSummaryUseCase(
    guestRepository,
    rsvpRepository,
    giftRepository
  ),
  confirmAttendanceUseCase: new ConfirmAttendanceUseCase(rsvpRepository),
  getGuestRsvpStatusUseCase: new GetGuestRsvpStatusUseCase(rsvpRepository),
  contributeToGiftUseCase: new ContributeToGiftUseCase(giftRepository, paymentGateway),
  listGuestContributionsUseCase: new ListGuestContributionsUseCase(giftRepository),
  guestRepository,
};
