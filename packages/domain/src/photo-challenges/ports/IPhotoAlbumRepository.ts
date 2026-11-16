import { ChallengePhoto } from '../entities/ChallengePhoto';

export interface IPhotoAlbumReader {
  listPhotos(): Promise<ChallengePhoto[]>;
}

export interface IPhotoAlbumWriter {
  savePhoto(photo: ChallengePhoto): Promise<void>;
  deletePhoto(photoId: string): Promise<void>;
}

export interface IPhotoAlbumRepository extends IPhotoAlbumReader, IPhotoAlbumWriter {}
