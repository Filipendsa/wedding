import { GiftContributionPrimitives } from '../entities/GiftContribution';
import { IGiftContributionReader } from '../ports/IGiftRepository';

export class ListGuestContributionsUseCase {
  constructor(private readonly giftReader: IGiftContributionReader) {}

  async execute(): Promise<GiftContributionPrimitives[]> {
    const contributions = await this.giftReader.listContributions();
    return contributions
      .map((item) => item.toPrimitives())
      .sort((a, b) => b.createdAt - a.createdAt);
  }
}
