import { WeddingInfo, WeddingPhotoCollection } from './types';

export const WEDDING_THEME = {
  colors: {
    linen: '#FBF9F5',       // Papel creme / fundo principal
    sandLight: '#F3ECE1',   // Areia suave alternada
    sand: '#DFD5C6',        // Bordas finas e detalhes
    olive: '#5A6346',       // Verde Oliva Editorial (botões pílula e destaques)
    oliveDark: '#434B32',   // Oliva profundo (banners e rodapé)
    sage: '#8C9275',        // Sálvia suave (ícones line-art e subtítulos)
    terracotta: '#B97A57',  // Destaque quente sutil
    charcoal: '#2C2623',    // Texto principal
    taupe: '#6E655F',       // Texto secundário
    cardBg: '#FFFFFF',
  },
  typography: {
    fontScript: "'Great Vibes', 'Playfair Display', cursive",
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

export const WEDDING_DETAILS: WeddingInfo = {
  brideName: 'Isabelle Nogueira da Silva',
  groomName: 'Vinícius Coradello de Souza',
  coupleNickname: 'Isabelle & Vinícius',
  monogram: 'I & V',
  hashtag: '#IsaEVini',
  dateEstimate: '15 de Maio de 2027',
  dateNumeric: '15 . 05 . 2027',
  targetDateISO: '2027-05-15T16:30:00-03:00',
  ceremonyTime: '16h30',
  venueName: 'Espaço Jardim das Oliveiras',
  venueAddress: 'Alameda das Palmeiras, 450 • Interior de São Paulo',
  pixKey: 'isabelle.vini.casamento@gmail.com',
  pixRecipient: 'Isabelle Nogueira / Vinícius Coradello',
  pixCity: 'Sao Paulo',
  photoBoothUrl:
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PHOTOS_URL) ||
    'http://localhost:3001',
};

/**
 * Central de fotos genéricas do casal (ensaio romântico).
 * Basta substituir as URLs abaixo pelas fotos reais dos noivos quando estiverem prontas.
 */
export const WEDDING_PHOTOS: WeddingPhotoCollection = {
  heroCouple:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85',
  countdownPolaroid:
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85',
  storyCouple:
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
  gallery1:
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85',
  gallery2:
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=85',
  gallery3:
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=85',
  gallery4:
    'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=85',
  shareLoveCouple:
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=85',
};
