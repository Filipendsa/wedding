export interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'noivos' | 'festa' | 'divertido' | 'detalhes';
  icon: string;
  rewardPoints: number;
}

export interface CapturedPhoto {
  id: string;
  missionId: string;
  guestName: string;
  timestamp: number;
  dataUrl: string;
  caption?: string;
  likes?: number;
}

export interface WeddingInfo {
  brideName: string;
  groomName: string;
  coupleNickname: string;
  monogram: string;
  hashtag: string;
  dateEstimate: string;
  dateNumeric: string;
  targetDateISO: string;
  ceremonyTime: string;
  venueName: string;
  venueAddress: string;
  pixKey: string;
  pixRecipient: string;
  pixCity: string;
  photoBoothUrl: string;
}

export interface WeddingPhotoCollection {
  heroCouple: string;
  countdownPolaroid: string;
  storyCouple: string;
  gallery1: string;
  gallery2: string;
  gallery3: string;
  gallery4: string;
  shareLoveCouple: string;
}

export interface GiftItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'viagem' | 'casa' | 'brincadeira' | 'romance';
  icon: string;
  supportsCustomAmount?: boolean;
}
