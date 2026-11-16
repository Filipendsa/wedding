import { PhotoFrameStyle } from '@wending/domain';

export interface PendingPhotoDraft {
  missionId: string;
  dataUrl: string;
  frameStyle: PhotoFrameStyle;
  capturedAt: number;
}

const DRAFT_STORAGE_KEY = 'wending_pending_photo_draft';
let memoryDraft: PendingPhotoDraft | null = null;

export const sessionPhotoDraftStore = {
  saveDraft(draft: PendingPhotoDraft): void {
    memoryDraft = draft;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      } catch {
        // High-res 4K dataUrls can exceed sessionStorage quota; memoryDraft keeps it across Next.js client navigation
      }
    }
  },

  getDraft(): PendingPhotoDraft | null {
    if (memoryDraft) return memoryDraft;
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
        if (raw) {
          memoryDraft = JSON.parse(raw) as PendingPhotoDraft;
          return memoryDraft;
        }
      } catch {
        return null;
      }
    }
    return null;
  },

  clearDraft(): void {
    memoryDraft = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  },
};
