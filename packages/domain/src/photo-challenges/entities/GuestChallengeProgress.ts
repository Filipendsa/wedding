import { PhotoChallenge, PhotoChallengePrimitives } from './PhotoChallenge';
import { ChallengePhoto, ChallengePhotoPrimitives } from './ChallengePhoto';

export interface GuestChallengeProgressSummary {
  totalMissions: number;
  completedMissionsCount: number;
  totalPhotosCount: number;
  totalPoints: number;
  progressPercent: number;
  isAllCompleted: boolean;
  rankTitle: string;
  nextSuggestedMission: PhotoChallengePrimitives | null;
}

export class GuestChallengeProgress {
  private constructor(
    private readonly challenges: PhotoChallenge[],
    private readonly photos: ChallengePhoto[]
  ) {}

  static evaluate(
    challenges: PhotoChallenge[],
    photos: ChallengePhoto[]
  ): GuestChallengeProgress {
    return new GuestChallengeProgress(challenges, photos);
  }

  getSummary(): GuestChallengeProgressSummary {
    const totalMissions = this.challenges.length;
    const completedIds = new Set(this.photos.map((p) => p.missionId));
    const completedChallenges = this.challenges.filter((c) => completedIds.has(c.id));
    const completedMissionsCount = completedChallenges.length;

    const totalPoints = this.photos.reduce((acc, photo) => {
      const challenge = this.challenges.find((c) => c.id === photo.missionId);
      return acc + (challenge?.rewardPoints ?? 50);
    }, 0);

    const progressPercent =
      totalMissions > 0 ? Math.round((completedMissionsCount / totalMissions) * 100) : 0;

    const isAllCompleted = totalMissions > 0 && completedMissionsCount === totalMissions;

    const nextSuggested =
      this.challenges.find((c) => !completedIds.has(c.id)) ?? this.challenges[0] ?? null;

    return {
      totalMissions,
      completedMissionsCount,
      totalPhotosCount: this.photos.length,
      totalPoints,
      progressPercent,
      isAllCompleted,
      rankTitle: this.resolveRankTitle(progressPercent),
      nextSuggestedMission: nextSuggested ? nextSuggested.toPrimitives() : null,
    };
  }

  getPhotosPrimitives(): ChallengePhotoPrimitives[] {
    return this.photos
      .map((p) => p.toPrimitives())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  private resolveRankTitle(progressPercent: number): string {
    if (progressPercent === 100) return 'Lenda do Casamento 100%';
    if (progressPercent >= 75) return 'Fotógrafo Oficial da Festa';
    if (progressPercent >= 40) return 'Caçador de Cliques';
    if (progressPercent > 0) return 'Convidado Explorador';
    return 'Pronto para Fotografar';
  }
}
