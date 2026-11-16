import { AttendanceConfirmationPrimitives } from '../entities/AttendanceConfirmation';
import { IRsvpReader } from '../ports/IRsvpRepository';

export class GetGuestRsvpStatusUseCase {
  constructor(private readonly rsvpReader: IRsvpReader) {}

  async execute(): Promise<AttendanceConfirmationPrimitives | null> {
    const existing = await this.rsvpReader.getLatestConfirmation();
    return existing ? existing.toPrimitives() : null;
  }
}
