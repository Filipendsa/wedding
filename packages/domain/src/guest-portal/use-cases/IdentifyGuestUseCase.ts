import { Result } from '../../shared/Result';
import { Guest, GuestPrimitives } from '../entities/Guest';
import { IGuestRepository } from '../ports/IGuestRepository';

export interface IdentifyGuestInput {
  name: string;
  phone?: string;
  tableHint?: string;
}

export class IdentifyGuestUseCase {
  constructor(private readonly guestRepository: IGuestRepository) {}

  async execute(input: IdentifyGuestInput): Promise<Result<GuestPrimitives>> {
    const existing = await this.guestRepository.getCurrentGuest();

    if (existing) {
      const updateResult = existing.updateProfile(input);
      if (updateResult.isFailure) {
        return Result.fail(updateResult.getError());
      }
      await this.guestRepository.saveGuest(existing);
      return Result.ok(existing.toPrimitives());
    }

    const createResult = Guest.create(input);
    if (createResult.isFailure) {
      return Result.fail(createResult.getError());
    }

    const guest = createResult.getValue();
    await this.guestRepository.saveGuest(guest);
    return Result.ok(guest.toPrimitives());
  }
}
