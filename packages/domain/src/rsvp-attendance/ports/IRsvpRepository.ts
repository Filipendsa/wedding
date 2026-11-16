import { AttendanceConfirmation } from '../entities/AttendanceConfirmation';

export interface IRsvpReader {
  getLatestConfirmation(): Promise<AttendanceConfirmation | null>;
}

export interface IRsvpWriter {
  saveConfirmation(confirmation: AttendanceConfirmation): Promise<void>;
}

export interface IRsvpRepository extends IRsvpReader, IRsvpWriter {}
