import { ValueObject } from '../../shared/ValueObject';

export type PhotoFrameStyle = 'tropical-badge' | 'polaroid' | 'clean';

interface PhotoStampMetadataProps {
  coupleNickname: string;
  missionTitle: string;
  guestName: string;
  frameStyle: PhotoFrameStyle;
}

export class PhotoStampMetadata extends ValueObject<PhotoStampMetadataProps> {
  private constructor(props: PhotoStampMetadataProps) {
    super(props);
  }

  static create(input: {
    coupleNickname: string;
    missionTitle: string;
    guestName: string;
    frameStyle?: PhotoFrameStyle;
  }): PhotoStampMetadata {
    return new PhotoStampMetadata({
      coupleNickname: input.coupleNickname.trim() || 'Isa & Vini',
      missionTitle: input.missionTitle.trim() || 'Momento Especial',
      guestName: input.guestName.trim() || 'Convidado Especial',
      frameStyle: input.frameStyle ?? 'tropical-badge',
    });
  }

  get coupleNickname(): string {
    return this.props.coupleNickname;
  }

  get missionTitle(): string {
    return this.props.missionTitle;
  }

  get guestName(): string {
    return this.props.guestName;
  }

  get frameStyle(): PhotoFrameStyle {
    return this.props.frameStyle;
  }
}
