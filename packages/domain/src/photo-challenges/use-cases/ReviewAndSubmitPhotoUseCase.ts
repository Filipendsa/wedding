import { Result } from '../../shared/Result';
import { ChallengePhoto, ChallengePhotoPrimitives } from '../entities/ChallengePhoto';
import { PhotoFrameStyle } from '../value-objects/PhotoStampMetadata';
import { IPhotoAlbumWriter } from '../ports/IPhotoAlbumRepository';

export interface ReviewAndSubmitPhotoInput {
  missionId: string;
  guestName: string;
  dataUrl: string;
  caption?: string;
  frameStyle?: PhotoFrameStyle;
}

export class ReviewAndSubmitPhotoUseCase {
  constructor(private readonly photoAlbumWriter: IPhotoAlbumWriter) {}

  async execute(input: ReviewAndSubmitPhotoInput): Promise<Result<ChallengePhotoPrimitives>> {
    const photoResult = ChallengePhoto.submit(input);
    if (photoResult.isFailure) {
      return Result.fail(photoResult.getError());
    }

    const photo = photoResult.getValue();
    await this.photoAlbumWriter.savePhoto(photo);
    return Result.ok(photo.toPrimitives());
  }
}
