import { AggregateRoot } from '../../shared/AggregateRoot';
import { Result } from '../../shared/Result';
import { GuestName } from '../../guest-portal/value-objects/GuestName';
import { PhotoFrameStyle } from '../value-objects/PhotoStampMetadata';

export type PhotoSyncStatus = 'LOCAL_SAVED' | 'SYNCED';

export interface ChallengePhotoProps {
  missionId: string;
  guestName: GuestName;
  dataUrl: string;
  caption?: string;
  frameStyle: PhotoFrameStyle;
  timestamp: number;
  likes: number;
  status: PhotoSyncStatus;
}

export interface ChallengePhotoPrimitives {
  id: string;
  missionId: string;
  guestName: string;
  dataUrl: string;
  caption?: string;
  frameStyle: PhotoFrameStyle;
  timestamp: number;
  likes: number;
  status: PhotoSyncStatus;
}

export class ChallengePhoto extends AggregateRoot<ChallengePhotoProps> {
  private constructor(props: ChallengePhotoProps, id?: string) {
    super(props, id);
  }

  static submit(input: {
    missionId: string;
    guestName: string;
    dataUrl: string;
    caption?: string;
    frameStyle?: PhotoFrameStyle;
  }): Result<ChallengePhoto> {
    if (!input.missionId.trim()) {
      return Result.fail('A foto precisa estar vinculada a uma missão.');
    }
    if (!input.dataUrl || !input.dataUrl.startsWith('data:image/')) {
      return Result.fail('Imagem capturada inválida.');
    }

    const guestResult = GuestName.create(input.guestName || 'Convidado Especial');
    if (guestResult.isFailure) {
      return Result.fail(guestResult.getError());
    }

    const now = Date.now();
    const photo = new ChallengePhoto(
      {
        missionId: input.missionId.trim(),
        guestName: guestResult.getValue(),
        dataUrl: input.dataUrl,
        caption: input.caption?.trim() || undefined,
        frameStyle: input.frameStyle ?? 'tropical-badge',
        timestamp: now,
        likes: 1,
        status: 'LOCAL_SAVED',
      },
      `${input.missionId}-${now}`
    );

    photo.addDomainEvent({
      eventName: 'ChallengePhotoSubmitted',
      occurredOn: new Date(now),
      aggregateId: photo.id,
    });

    return Result.ok(photo);
  }

  static restore(data: ChallengePhotoPrimitives): Result<ChallengePhoto> {
    const guestResult = GuestName.create(data.guestName || 'Convidado Especial');
    if (guestResult.isFailure) {
      return Result.fail(guestResult.getError());
    }

    return Result.ok(
      new ChallengePhoto(
        {
          missionId: data.missionId,
          guestName: guestResult.getValue(),
          dataUrl: data.dataUrl,
          caption: data.caption,
          frameStyle: data.frameStyle ?? 'tropical-badge',
          timestamp: data.timestamp,
          likes: data.likes ?? 1,
          status: data.status ?? 'LOCAL_SAVED',
        },
        data.id
      )
    );
  }

  get missionId(): string {
    return this.props.missionId;
  }

  get timestamp(): number {
    return this.props.timestamp;
  }

  toPrimitives(): ChallengePhotoPrimitives {
    return {
      id: this._id,
      missionId: this.props.missionId,
      guestName: this.props.guestName.value,
      dataUrl: this.props.dataUrl,
      caption: this.props.caption,
      frameStyle: this.props.frameStyle,
      timestamp: this.props.timestamp,
      likes: this.props.likes,
      status: this.props.status,
    };
  }
}
