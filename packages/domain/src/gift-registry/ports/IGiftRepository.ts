import { GiftContribution } from '../entities/GiftContribution';

export interface IGiftContributionReader {
  listContributions(): Promise<GiftContribution[]>;
}

export interface IGiftContributionWriter {
  saveContribution(contribution: GiftContribution): Promise<void>;
}

export interface IGiftRepository extends IGiftContributionReader, IGiftContributionWriter {}
