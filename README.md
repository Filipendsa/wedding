# 🌺 Casamento Isa & Vini — Monorepo (Screaming Architecture + DDD + SOLID)

Sistema completo para o casamento de **Isabelle Nogueira da Silva & Vinícius Coradello de Souza**, estruturado com **Screaming Architecture**, **Domain-Driven Design (DDD)**, princípios **SOLID** e **Domínios Ricos**:

- **Convite Digital & História dos Noivos** (`apps/web`)
- **Painel do Convidado** (`apps/web/painel`)
- **Confirmação de Presença (RSVP)** (`apps/web`)
- **Catálogo de Presentes com Checkout PIX (EMV BR Code) & Cartão de Crédito** (`apps/web`)
- **Photo Booth Oficial com Desafios Fotográficos via QR Code** (`apps/photos`)

---

## 📁 Arquitetura do Monorepo

```text
wending/
├── packages/
│   ├── domain/                 # Núcleo de Domínios Ricos (DDD + SOLID, zero framework)
│   │   ├── shared/             # Entity, AggregateRoot, ValueObject, Result, Money, PhoneNumber
│   │   ├── guest-portal/       # Painel do Convidado (Guest, GuestName, Use Cases, Ports)
│   │   ├── rsvp-attendance/    # Confirmação de Presença (AttendanceConfirmation, CompanionCount)
│   │   ├── gift-registry/      # Presentes & Doações (GiftOption, GiftContribution, PixBrCode, CardPaymentDetails)
│   │   └── photo-challenges/   # Photo Booth & Desafios (PhotoChallenge, ChallengePhoto, GuestChallengeProgress)
│   ├── ui/                     # Design System Tropical Chic (Button, Card, Badge, Modal, ProgressBar, QrCodeSvg)
│   ├── utils/                  # Dados do casamento, catálogos de missões/presentes e gerador de matriz QR
│   └── config/                 # Configurações base compartilhadas de TypeScript
│
├── apps/
│   ├── web/                    # Site Principal + Painel do Convidado (`/`, `/painel`)
│   │   └── src/
│   │       ├── features/       # wedding-story, guest-panel, rsvp, gifts-checkout
│   │       └── infrastructure/ # Adapters (LocalStorage Repositories, PixAndCardPaymentGateway, Container)
│   │
│   └── photos/                 # App Photo Booth PWA (`/`, `/missions`, `/camera`, `/review`, `/gallery`)
│       └── src/
│           ├── features/       # guest-welcome, challenge-board, camera-booth, photo-review, guest-gallery
│           └── infrastructure/ # Adapters (ImageCapture/Canvas Strategies, IndexedDB Repository, Container)
│
├── turbo.json
└── package.json
```

---

## 🎨 Paleta de Cores Oficial (Tropical Chic)

- **Areia Dourada**: `#E4C7A5`
- **Oliva Tropical**: `#9C9851`
- **Pôr do Sol**: `#E4911E`
- **Orquídea Vibrante**: `#EB73D3`
- **Frésia / Magenta**: `#DD1F55`

---

## 🚀 Como Executar Localmente

```bash
# Typecheck / Lint de todo o monorepo
npm run lint

# Build de produção de todos os apps
npm run build

# Rodar o Site Principal + Painel do Convidado (porta 3000)
npm run dev:web

# Rodar o Photo Booth + Desafios (porta 3001)
npm run dev:photos
```
