// Shared Kernel
export * from './shared';

// Bounded Context: Guest Portal
export * from './guest-portal/value-objects/GuestName';
export * from './guest-portal/entities/Guest';
export * from './guest-portal/ports/IGuestRepository';
export * from './guest-portal/use-cases/IdentifyGuestUseCase';
export * from './guest-portal/use-cases/GetGuestDashboardSummaryUseCase';

// Bounded Context: RSVP Attendance
export * from './rsvp-attendance/value-objects/CompanionCount';
export * from './rsvp-attendance/entities/AttendanceConfirmation';
export * from './rsvp-attendance/ports/IRsvpRepository';
export * from './rsvp-attendance/use-cases/ConfirmAttendanceUseCase';
export * from './rsvp-attendance/use-cases/GetGuestRsvpStatusUseCase';

// Bounded Context: Gift Registry & Donations (PIX + Credit Card)
export * from './gift-registry/value-objects/PixBrCode';
export * from './gift-registry/value-objects/CardPaymentDetails';
export * from './gift-registry/entities/GiftOption';
export * from './gift-registry/entities/GiftContribution';
export * from './gift-registry/ports/IGiftRepository';
export * from './gift-registry/ports/IPaymentGateway';
export * from './gift-registry/use-cases/ContributeToGiftUseCase';
export * from './gift-registry/use-cases/ListGuestContributionsUseCase';

// Bounded Context: Photo Challenges (Photo Booth)
export * from './photo-challenges/value-objects/PhotoStampMetadata';
export * from './photo-challenges/entities/PhotoChallenge';
export * from './photo-challenges/entities/ChallengePhoto';
export * from './photo-challenges/entities/GuestChallengeProgress';
export * from './photo-challenges/ports/IPhotoAlbumRepository';
export * from './photo-challenges/ports/ICameraCaptureStrategy';
export * from './photo-challenges/use-cases/ReviewAndSubmitPhotoUseCase';
export * from './photo-challenges/use-cases/GetChallengeBoardUseCase';
export * from './photo-challenges/use-cases/DeleteGuestPhotoUseCase';
