import { PhotoStampMetadata } from '../value-objects/PhotoStampMetadata';

export interface CameraCaptureContext {
  videoElement: HTMLVideoElement;
  stream: MediaStream;
}

export interface ICameraCaptureStrategy {
  readonly strategyName: string;
  isSupported(context: CameraCaptureContext): boolean;
  captureRawFrame(context: CameraCaptureContext): Promise<ImageBitmap | HTMLVideoElement>;
}

export interface IPhotoStampRenderer {
  renderWithStamp(
    source: ImageBitmap | HTMLVideoElement | HTMLImageElement,
    metadata: PhotoStampMetadata
  ): Promise<string>;
}
