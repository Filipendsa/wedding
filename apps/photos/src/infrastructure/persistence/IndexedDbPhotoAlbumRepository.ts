import {
  ChallengePhoto,
  ChallengePhotoPrimitives,
  IPhotoAlbumRepository,
} from '@wending/domain';

const DB_NAME = 'IsaViniWeddingPhotosDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB não suportado neste navegador'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('missionId', 'missionId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class IndexedDbPhotoAlbumRepository implements IPhotoAlbumRepository {
  async listPhotos(): Promise<ChallengePhoto[]> {
    try {
      const db = await openDB();
      const rawItems = await new Promise<ChallengePhotoPrimitives[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve((request.result || []) as ChallengePhotoPrimitives[]);
        request.onerror = () => reject(request.error);
      });

      return rawItems
        .map((item) =>
          ChallengePhoto.restore({
            ...item,
            frameStyle: item.frameStyle ?? 'tropical-badge',
            status: item.status ?? 'LOCAL_SAVED',
            likes: item.likes ?? 1,
          })
        )
        .filter((res) => res.isSuccess)
        .map((res) => res.getValue());
    } catch (err) {
      console.warn('Erro ao carregar do IndexedDB:', err);
      return [];
    }
  }

  async savePhoto(photo: ChallengePhoto): Promise<void> {
    const db = await openDB();
    const payload = photo.toPrimitives();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(payload);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deletePhoto(photoId: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(photoId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
