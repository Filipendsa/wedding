import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Casamento de Isabelle & Vinícius • Convite & Painel do Convidado',
  description:
    'Site oficial do casamento de Isabelle Nogueira da Silva & Vinícius Coradello de Souza. Confirme sua presença, presenteie via PIX ou Cartão, acesse o Painel do Convidado e participe dos desafios do Photo Booth!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
