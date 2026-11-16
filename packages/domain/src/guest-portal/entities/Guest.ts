import { AggregateRoot } from '../../shared/AggregateRoot';
import { PhoneNumber } from '../../shared/PhoneNumber';
import { Result } from '../../shared/Result';
import { GuestName } from '../value-objects/GuestName';

export interface GuestProps {
  name: GuestName;
  phone?: PhoneNumber;
  tableHint?: string;
  createdAt: number;
  updatedAt: number;
}

export interface GuestPrimitives {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  phone?: string;
  formattedPhone?: string;
  tableHint?: string;
  createdAt: number;
  updatedAt: number;
}

export class Guest extends AggregateRoot<GuestProps> {
  private constructor(props: GuestProps, id?: string) {
    super(props, id);
  }

  static create(input: {
    name: string;
    phone?: string;
    tableHint?: string;
  }): Result<Guest> {
    const nameResult = GuestName.create(input.name);
    if (nameResult.isFailure) {
      return Result.fail(nameResult.getError());
    }

    let phoneVO: PhoneNumber | undefined;
    if (input.phone && input.phone.trim().length > 0) {
      const phoneResult = PhoneNumber.create(input.phone);
      if (phoneResult.isFailure) {
        return Result.fail(phoneResult.getError());
      }
      phoneVO = phoneResult.getValue();
    }

    const now = Date.now();
    const guest = new Guest({
      name: nameResult.getValue(),
      phone: phoneVO,
      tableHint: input.tableHint?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });

    guest.addDomainEvent({
      eventName: 'GuestIdentified',
      occurredOn: new Date(now),
      aggregateId: guest.id,
    });

    return Result.ok(guest);
  }

  static restore(data: {
    id: string;
    name: string;
    phone?: string;
    tableHint?: string;
    createdAt: number;
    updatedAt: number;
  }): Result<Guest> {
    const nameResult = GuestName.create(data.name);
    if (nameResult.isFailure) {
      return Result.fail(nameResult.getError());
    }

    let phoneVO: PhoneNumber | undefined;
    if (data.phone) {
      const phoneResult = PhoneNumber.create(data.phone);
      if (phoneResult.isSuccess) {
        phoneVO = phoneResult.getValue();
      }
    }

    return Result.ok(
      new Guest(
        {
          name: nameResult.getValue(),
          phone: phoneVO,
          tableHint: data.tableHint,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        data.id
      )
    );
  }

  get name(): GuestName {
    return this.props.name;
  }

  get phone(): PhoneNumber | undefined {
    return this.props.phone;
  }

  updateProfile(input: { name: string; phone?: string; tableHint?: string }): Result<void> {
    const nameResult = GuestName.create(input.name);
    if (nameResult.isFailure) {
      return Result.fail(nameResult.getError());
    }

    let phoneVO = this.props.phone;
    if (input.phone !== undefined) {
      if (input.phone.trim().length === 0) {
        phoneVO = undefined;
      } else {
        const phoneResult = PhoneNumber.create(input.phone);
        if (phoneResult.isFailure) {
          return Result.fail(phoneResult.getError());
        }
        phoneVO = phoneResult.getValue();
      }
    }

    this.props = {
      ...this.props,
      name: nameResult.getValue(),
      phone: phoneVO,
      tableHint: input.tableHint?.trim() || this.props.tableHint,
      updatedAt: Date.now(),
    };

    return Result.ok(undefined);
  }

  buildPhotoBoothUrl(baseUrl: string): string {
    const cleanBase = baseUrl.replace(/\/$/, '');
    const params = new URLSearchParams({ guest: this.props.name.value });
    return `${cleanBase}/?${params.toString()}`;
  }

  toPrimitives(): GuestPrimitives {
    return {
      id: this._id,
      name: this.props.name.value,
      firstName: this.props.name.firstName,
      initials: this.props.name.initials,
      phone: this.props.phone?.digits,
      formattedPhone: this.props.phone?.format(),
      tableHint: this.props.tableHint,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
