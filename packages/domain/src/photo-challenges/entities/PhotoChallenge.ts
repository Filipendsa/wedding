import { Entity } from '../../shared/Entity';

export type ChallengeCategory = 'noivos' | 'festa' | 'divertido' | 'detalhes';

export interface PhotoChallengeProps {
  title: string;
  description: string;
  category: ChallengeCategory;
  icon: string;
  rewardPoints: number;
}

export interface PhotoChallengePrimitives {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  icon: string;
  rewardPoints: number;
}

export class PhotoChallenge extends Entity<PhotoChallengeProps> {
  private constructor(props: PhotoChallengeProps, id: string) {
    super(props, id);
  }

  static create(input: PhotoChallengePrimitives): PhotoChallenge {
    return new PhotoChallenge(
      {
        title: input.title,
        description: input.description,
        category: input.category,
        icon: input.icon,
        rewardPoints: Math.max(10, input.rewardPoints),
      },
      input.id
    );
  }

  get title(): string {
    return this.props.title;
  }

  get category(): ChallengeCategory {
    return this.props.category;
  }

  get rewardPoints(): number {
    return this.props.rewardPoints;
  }

  toPrimitives(): PhotoChallengePrimitives {
    return {
      id: this._id,
      title: this.props.title,
      description: this.props.description,
      category: this.props.category,
      icon: this.props.icon,
      rewardPoints: this.props.rewardPoints,
    };
  }
}
