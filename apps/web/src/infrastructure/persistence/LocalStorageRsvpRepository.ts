import {
  AttendanceConfirmation,
  AttendanceStatus,
  IRsvpRepository,
} from '@wending/domain';

const STORAGE_KEY = 'wending_rsvp_confirmation_v2';

interface StoredRsvp {
  id: string;
  guestName: string;
  phone: string;
  status: AttendanceStatus;
  companionsCount: number;
  dietaryRestrictions?: string;
  message?: string;
  confirmedAt: number;
  updatedAt: number;
}

export class LocalStorageRsvpRepository implements IRsvpRepository {
  async getLatestConfirmation(): Promise<AttendanceConfirmation | null> {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as StoredRsvp;
      const result = AttendanceConfirmation.restore(parsed);
      return result.isSuccess ? result.getValue() : null;
    } catch {
      return null;
    }
  }

  async saveConfirmation(confirmation: AttendanceConfirmation): Promise<void> {
    if (typeof window === 'undefined') return;
    const p = confirmation.toPrimitives();
    const payload: StoredRsvp = {
      id: p.id,
      guestName: p.guestName,
      phone: p.phone,
      status: p.status,
      companionsCount: p.companionsCount,
      dietaryRestrictions: p.dietaryRestrictions,
      message: p.message,
      confirmedAt: p.confirmedAt,
      updatedAt: p.updatedAt,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
}
