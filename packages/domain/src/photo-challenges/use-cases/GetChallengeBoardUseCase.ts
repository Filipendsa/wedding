import { PhotoChallenge, PhotoChallengePrimitives } from '../entities/PhotoChallenge';
import { ChallengePhotoPrimitives } from '../entities/ChallengePhoto';
import {
  GuestChallengeProgress,
  GuestChallengeProgressSummary,
} from '../entities/GuestChallengeProgress';
import { IPhotoAlbumReader } from '../ports/IPhotoAlbumRepository';

export interface ChallengeBoardOutput {
  challenges: PhotoChallengePrimitives[];
  photos: ChallengePhotoPrimitives[];
  progress: GuestChallengeProgressSummary;
}

export class GetChallengeBoardUseCase {
  constructor(
    private readonly photoAlbumReader: IPhotoAlbumReader,
    private readonly catalog: PhotoChallengePrimitives[]
  ) {}

  async execute(): Promise<ChallengeBoardOutput> {
    const challengeEntities = this.catalog.map((item) => PhotoChallenge.create(item));
    const photos = await this.photoAlbumReader.listPhotos();

    const evaluator = GuestChallengeProgress.evaluate(challengeEntities, photos);

    return {
      challenges: challengeEntities.map((c) => c.toPrimitives()),
      photos: evaluator.getPhotosPrimitives(),
      progress: evaluator.getSummary(),
    };
  }
}
