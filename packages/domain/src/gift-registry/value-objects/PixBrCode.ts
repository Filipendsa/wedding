import { ValueObject } from '../../shared/ValueObject';
import { Money } from '../../shared/Money';
import { Result } from '../../shared/Result';

interface PixBrCodeProps {
  payload: string;
  pixKey: string;
  txId: string;
}

function normalizeAscii(text: string, maxLength: number): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function computeCrc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export class PixBrCode extends ValueObject<PixBrCodeProps> {
  private constructor(props: PixBrCodeProps) {
    super(props);
  }

  static generate(input: {
    pixKey: string;
    recipientName: string;
    city?: string;
    amount: Money;
    txId?: string;
  }): Result<PixBrCode> {
    const cleanKey = input.pixKey.trim();
    if (!cleanKey) {
      return Result.fail('Chave PIX não configurada.');
    }

    const merchantName = normalizeAscii(input.recipientName || 'ISA E VINI', 25) || 'ISA E VINI';
    const merchantCity = normalizeAscii(input.city || 'SAO PAULO', 15) || 'SAO PAULO';
    const cleanTxId =
      (input.txId || `WEND${Date.now().toString(36)}`)
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase()
        .slice(0, 25) || 'WENDING';

    const gui = tlv('00', 'br.gov.bcb.pix');
    const keyField = tlv('01', cleanKey);
    const merchantAccount = tlv('26', `${gui}${keyField}`);
    const additionalData = tlv('62', tlv('05', cleanTxId));
    const formattedAmount = input.amount.reais.toFixed(2);

    const bodyWithoutCrc =
      tlv('00', '01') +
      merchantAccount +
      tlv('52', '0000') +
      tlv('53', '986') +
      tlv('54', formattedAmount) +
      tlv('58', 'BR') +
      tlv('59', merchantName) +
      tlv('60', merchantCity) +
      additionalData +
      '6304';

    const crc = computeCrc16(bodyWithoutCrc);
    return Result.ok(
      new PixBrCode({
        payload: `${bodyWithoutCrc}${crc}`,
        pixKey: cleanKey,
        txId: cleanTxId,
      })
    );
  }

  get payload(): string {
    return this.props.payload;
  }

  get pixKey(): string {
    return this.props.pixKey;
  }

  get txId(): string {
    return this.props.txId;
  }
}
