import { IPhotoAlbumWriter } from '../ports/IPhotoAlbumRepository';

export class DeleteGuestPhotoUseCase {
  constructor(private readonly photoAlbumWriter: IPhotoAlbumWriter) {}

  async execute(photoId: string): Promise<void> {
    await this.photoAlbumWriter.deletePhoto(photoId);
  }
}
