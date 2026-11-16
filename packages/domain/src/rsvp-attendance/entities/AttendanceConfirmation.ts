import { AggregateRoot } from '../../shared/AggregateRoot';
import { PhoneNumber } from '../../shared/PhoneNumber';
import { Result } from '../../shared/Result';
import { GuestName } from '../../guest-portal/value-objects/GuestName';
import { CompanionCount } from '../value-objects/CompanionCount';

export type AttendanceStatus = 'CONFIRMED' | 'DECLINED';

export interface AttendanceConfirmationProps {
  guestName: GuestName;
  phone: PhoneNumber;
  status: AttendanceStatus;
  companionsCount: CompanionCount;
  dietaryRestrictions?: string;
  message?: string;
  confirmedAt: number;
  updatedAt: number;
}

export interface AttendanceConfirmationPrimitives {
  id: string;
  guestName: string;
  phone: string;
  formattedPhone: string;
  status: AttendanceStatus;
  companionsCount: number;
  totalPartySize: number;
  dietaryRestrictions?: string;
  message?: string;
  confirmedAt: number;
  updatedAt: number;
}

export class AttendanceConfirmation extends AggregateRoot<AttendanceConfirmationProps> {
  private constructor(props: AttendanceConfirmationProps, id?: string) {
    super(props, id);
  }

  static submit(input: {
    guestName: string;
    phone: string;
    attending: boolean;
    companionsCount: number;
    dietaryRestrictions?: string;
    message?: string;
  }): Result<AttendanceConfirmation> {
    const nameResult = GuestName.create(input.guestName);
    if (nameResult.isFailure) {
      return Result.fail(nameResult.getError());
    }

    const phoneResult = PhoneNumber.create(input.phone);
    if (phoneResult.isFailure) {
      return Result.fail(phoneResult.getError());
    }

    // Invariant: if guest declined, companions count is always 0
    const normalizedCompanions = input.attending ? input.companionsCount : 0;
    const companionsResult = CompanionCount.create(normalizedCompanions);
    if (companionsResult.isFailure) {
      return Result.fail(companionsResult.getError());
    }

    const now = Date.now();
    const status: AttendanceStatus = input.attending ? 'CONFIRMED' : 'DECLINED';

    const confirmation = new AttendanceConfirmation({
      guestName: nameResult.getValue(),
      phone: phoneResult.getValue(),
      status,
      companionsCount: companionsResult.getValue(),
      dietaryRestrictions: input.attending
        ? input.dietaryRestrictions?.trim() || undefined
        : undefined,
      message: input.message?.trim() || undefined,
      confirmedAt: now,
      updatedAt: now,
    });

    confirmation.addDomainEvent({
      eventName: input.attending ? 'GuestAttendanceConfirmed' : 'GuestAttendanceDeclined',
      occurredOn: new Date(now),
      aggregateId: confirmation.id,
    });

    return Result.ok(confirmation);
  }

  static restore(data: {
    id: string;
    guestName: string;
    phone: string;
    status: AttendanceStatus;
    companionsCount: number;
    dietaryRestrictions?: string;
    message?: string;
    confirmedAt: number;
    updatedAt: number;
  }): Result<AttendanceConfirmation> {
    const nameResult = GuestName.create(data.guestName);
    const phoneResult = PhoneNumber.create(data.phone);
    const companionsResult = CompanionCount.create(
      data.status === 'CONFIRMED' ? data.companionsCount : 0
    );

    if (nameResult.isFailure || phoneResult.isFailure || companionsResult.isFailure) {
      return Result.fail('Dados de confirmação RSVP inválidos ao restaurar.');
    }

    return Result.ok(
      new AttendanceConfirmation(
        {
          guestName: nameResult.getValue(),
          phone: phoneResult.getValue(),
          status: data.status,
          companionsCount: companionsResult.getValue(),
          dietaryRestrictions: data.dietaryRestrictions,
          message: data.message,
          confirmedAt: data.confirmedAt,
          updatedAt: data.updatedAt,
        },
        data.id
      )
    );
  }

  get status(): AttendanceStatus {
    return this.props.status;
  }

  get totalPartySize(): number {
    return this.props.status === 'CONFIRMED' ? 1 + this.props.companionsCount.value : 0;
  }

  updateResponse(input: {
    guestName: string;
    phone: string;
    attending: boolean;
    companionsCount: number;
    dietaryRestrictions?: string;
    message?: string;
  }): Result<void> {
    const nextResult = AttendanceConfirmation.submit(input);
    if (nextResult.isFailure) {
      return Result.fail(nextResult.getError());
    }

    const next = nextResult.getValue();
    this.props = {
      ...next.props,
      confirmedAt: this.props.confirmedAt,
      updatedAt: Date.now(),
    };

    this.addDomainEvent({
      eventName: 'GuestAttendanceUpdated',
      occurredOn: new Date(this.props.updatedAt),
      aggregateId: this._id,
    });

    return Result.ok(undefined);
  }

  toPrimitives(): AttendanceConfirmationPrimitives {
    return {
      id: this._id,
      guestName: this.props.guestName.value,
      phone: this.props.phone.digits,
      formattedPhone: this.props.phone.format(),
      status: this.props.status,
      companionsCount: this.props.companionsCount.value,
      totalPartySize: this.totalPartySize,
      dietaryRestrictions: this.props.dietaryRestrictions,
      message: this.props.message,
      confirmedAt: this.props.confirmedAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
