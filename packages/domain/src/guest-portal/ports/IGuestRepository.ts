import { Guest } from '../entities/Guest';

export interface IGuestReader {
  getCurrentGuest(): Promise<Guest | null>;
}

export interface IGuestWriter {
  saveGuest(guest: Guest): Promise<void>;
  clearGuest(): Promise<void>;
}

export interface IGuestRepository extends IGuestReader, IGuestWriter {}
