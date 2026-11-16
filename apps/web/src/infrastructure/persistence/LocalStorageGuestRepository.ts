import { Guest, IGuestRepository } from '@wending/domain';

const STORAGE_KEY = 'wending_guest_profile_v2';

interface StoredGuest {
  id: string;
  name: string;
  phone?: string;
  tableHint?: string;
  createdAt: number;
  updatedAt: number;
}

export class LocalStorageGuestRepository implements IGuestRepository {
  async getCurrentGuest(): Promise<Guest | null> {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as StoredGuest;
      const result = Guest.restore(parsed);
      return result.isSuccess ? result.getValue() : null;
    } catch {
      return null;
    }
  }

  async saveGuest(guest: Guest): Promise<void> {
    if (typeof window === 'undefined') return;
    const data = guest.toPrimitives();
    const payload: StoredGuest = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      tableHint: data.tableHint,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  async clearGuest(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
}
