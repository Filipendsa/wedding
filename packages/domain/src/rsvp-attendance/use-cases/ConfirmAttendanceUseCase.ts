import { Result } from '../../shared/Result';
import {
  AttendanceConfirmation,
  AttendanceConfirmationPrimitives,
} from '../entities/AttendanceConfirmation';
import { IRsvpRepository } from '../ports/IRsvpRepository';

export interface ConfirmAttendanceInput {
  guestName: string;
  phone: string;
  attending: boolean;
  companionsCount: number;
  dietaryRestrictions?: string;
  message?: string;
}

export class ConfirmAttendanceUseCase {
  constructor(private readonly rsvpRepository: IRsvpRepository) {}

  async execute(
    input: ConfirmAttendanceInput
  ): Promise<Result<AttendanceConfirmationPrimitives>> {
    const existing = await this.rsvpRepository.getLatestConfirmation();

    if (existing) {
      const updateResult = existing.updateResponse(input);
      if (updateResult.isFailure) {
        return Result.fail(updateResult.getError());
      }
      await this.rsvpRepository.saveConfirmation(existing);
      return Result.ok(existing.toPrimitives());
    }

    const createResult = AttendanceConfirmation.submit(input);
    if (createResult.isFailure) {
      return Result.fail(createResult.getError());
    }

    const confirmation = createResult.getValue();
    await this.rsvpRepository.saveConfirmation(confirmation);
    return Result.ok(confirmation.toPrimitives());
  }
}
