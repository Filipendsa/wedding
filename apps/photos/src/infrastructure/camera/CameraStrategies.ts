import {
  CameraCaptureContext,
  ICameraCaptureStrategy,
  IPhotoStampRenderer,
  PhotoStampMetadata,
} from '@wending/domain';

export interface CameraConstraintsOptions {
  facingMode: 'user' | 'environment';
}

export async function getCameraStream(options: CameraConstraintsOptions): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Acesso à câmera não é suportado pelo seu navegador.');
  }

  const highResConstraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: options.facingMode },
      width: { ideal: 3840 },
      height: { ideal: 2160 },
    },
  };

  try {
    return await navigator.mediaDevices.getUserMedia(highResConstraints);
  } catch {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: options.facingMode },
    });
  }
}

interface ImageCaptureLike {
  takePhoto(photoSettings?: { imageWidth?: number; imageHeight?: number }): Promise<Blob>;
}

export class ImageCaptureApiStrategy implements ICameraCaptureStrategy {
  readonly strategyName = 'ImageCaptureAPI';

  isSupported(context: CameraCaptureContext): boolean {
    const track = context.stream.getVideoTracks()[0];
    return typeof window !== 'undefined' && Boolean(track && 'ImageCapture' in window);
  }

  async captureRawFrame(context: CameraCaptureContext): Promise<ImageBitmap> {
    const track = context.stream.getVideoTracks()[0];
    const ImageCaptureCtor = (
      window as unknown as { ImageCapture: new (t: MediaStreamTrack) => ImageCaptureLike }
    ).ImageCapture;
    const imageCapture = new ImageCaptureCtor(track);
    const photoBlob = await imageCapture.takePhoto({
      imageWidth: 3840,
      imageHeight: 2160,
    });
    return createImageBitmap(photoBlob);
  }
}

export class CanvasVideoFrameStrategy implements ICameraCaptureStrategy {
  readonly strategyName = 'CanvasVideoFrame';

  isSupported(context: CameraCaptureContext): boolean {
    return Boolean(context.videoElement && context.videoElement.videoWidth > 0);
  }

  async captureRawFrame(context: CameraCaptureContext): Promise<HTMLVideoElement> {
    return context.videoElement;
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export class CanvasPhotoStampRenderer implements IPhotoStampRenderer {
  async renderWithStamp(
    source: ImageBitmap | HTMLVideoElement | HTMLImageElement,
    metadata: PhotoStampMetadata
  ): Promise<string> {
    const naturalWidth =
      source instanceof HTMLVideoElement
        ? source.videoWidth || 1920
        : source instanceof HTMLImageElement
        ? source.naturalWidth || 1920
        : source.width;

    const naturalHeight =
      source instanceof HTMLVideoElement
        ? source.videoHeight || 1080
        : source instanceof HTMLImageElement
        ? source.naturalHeight || 1080
        : source.height;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Não foi possível inicializar o contexto de desenho.');
    }

    if (metadata.frameStyle === 'polaroid') {
      const padSide = Math.round(naturalWidth * 0.045);
      const padBottom = Math.round(naturalHeight * 0.14);
      canvas.width = naturalWidth + padSide * 2;
      canvas.height = naturalHeight + padSide + padBottom;

      ctx.fillStyle = '#FBF9F5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(source, padSide, padSide, naturalWidth, naturalHeight);

      const scale = Math.max(naturalWidth, naturalHeight) / 1920;
      ctx.fillStyle = '#2C2623';
      ctx.font = `600 ${32 * scale}px "Cormorant Garamond", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.fillText(
        `${metadata.coupleNickname} • ${metadata.missionTitle}`,
        canvas.width / 2,
        naturalHeight + padSide + padBottom * 0.45
      );

      ctx.fillStyle = '#5A6346';
      ctx.font = `600 ${21 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(
        `Foto por: ${metadata.guestName}`,
        canvas.width / 2,
        naturalHeight + padSide + padBottom * 0.78
      );
      return canvas.toDataURL('image/jpeg', 0.95);
    }

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    ctx.drawImage(source, 0, 0, naturalWidth, naturalHeight);

    if (metadata.frameStyle === 'tropical-badge') {
      const scale = Math.max(naturalWidth, naturalHeight) / 1920;
      const pad = 28 * scale;
      const badgeHeight = 76 * scale;
      const badgeWidth = Math.min(naturalWidth - pad * 2, 540 * scale);
      const x = naturalWidth - badgeWidth - pad;
      const y = naturalHeight - badgeHeight - pad;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 16 * scale;
      ctx.shadowOffsetY = 4 * scale;

      ctx.fillStyle = 'rgba(67, 75, 50, 0.9)';
      drawRoundedRect(ctx, x, y, badgeWidth, badgeHeight, 12 * scale);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#DFD5C6';
      ctx.lineWidth = 2 * scale;
      drawRoundedRect(ctx, x, y, badgeWidth, badgeHeight, 12 * scale);
      ctx.stroke();

      ctx.fillStyle = '#FBF9F5';
      ctx.font = `600 ${20 * scale}px "Cormorant Garamond", Georgia, serif`;
      ctx.fillText(
        `${metadata.coupleNickname} • Missão Cumprida`,
        x + 16 * scale,
        y + 30 * scale
      );

      ctx.fillStyle = '#F3ECE1';
      ctx.font = `${14 * scale}px "Plus Jakarta Sans", sans-serif`;
      const subtext = `${metadata.missionTitle} • Por: ${metadata.guestName}`;
      ctx.fillText(subtext.slice(0, 48), x + 16 * scale, y + 56 * scale);
      ctx.restore();
    }

    return canvas.toDataURL('image/jpeg', 0.95);
  }
}

export class CameraCaptureCoordinator {
  constructor(
    private readonly strategies: ICameraCaptureStrategy[],
    private readonly stampRenderer: IPhotoStampRenderer
  ) {}

  async captureAndStamp(
    context: CameraCaptureContext,
    metadata: PhotoStampMetadata
  ): Promise<string> {
    let rawFrame: ImageBitmap | HTMLVideoElement | null = null;

    for (const strategy of this.strategies) {
      if (!strategy.isSupported(context)) continue;
      try {
        rawFrame = await strategy.captureRawFrame(context);
        break;
      } catch (err) {
        console.info(`Fallback from ${strategy.strategyName}:`, err);
      }
    }

    if (!rawFrame) {
      rawFrame = context.videoElement;
    }

    return this.stampRenderer.renderWithStamp(rawFrame, metadata);
  }
}
