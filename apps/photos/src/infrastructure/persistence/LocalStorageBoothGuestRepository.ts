import { Guest, IGuestRepository } from '@wending/domain';

const GUEST_STORAGE_KEY = 'wending_guest_profile_v2';
const LEGACY_NAME_KEY = 'isa_vini_guest_name';

export class LocalStorageBoothGuestRepository implements IGuestRepository {
  async getCurrentGuest(): Promise<Guest | null> {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const res = Guest.restore(parsed);
        if (res.isSuccess) return res.getValue();
      } catch {
        // Ignore corrupt storage
      }
    }

    const legacyName = localStorage.getItem(LEGACY_NAME_KEY);
    if (legacyName) {
      const res = Guest.create({ name: legacyName });
      if (res.isSuccess) return res.getValue();
    }

    return null;
  }

  async saveGuest(guest: Guest): Promise<void> {
    if (typeof window === 'undefined') return;
    const data = guest.toPrimitives();
    localStorage.setItem(
      GUEST_STORAGE_KEY,
      JSON.stringify({
        id: data.id,
        name: data.name,
        phone: data.phone,
        tableHint: data.tableHint,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
    );
    localStorage.setItem(LEGACY_NAME_KEY, data.name);
  }

  async clearGuest(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GUEST_STORAGE_KEY);
    localStorage.removeItem(LEGACY_NAME_KEY);
  }
}
