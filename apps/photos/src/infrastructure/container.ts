import {
  DeleteGuestPhotoUseCase,
  GetChallengeBoardUseCase,
  IdentifyGuestUseCase,
  ReviewAndSubmitPhotoUseCase,
} from '@wending/domain';
import { WEDDING_MISSIONS } from '@wending/utils';
import {
  CameraCaptureCoordinator,
  CanvasPhotoStampRenderer,
  CanvasVideoFrameStrategy,
  ImageCaptureApiStrategy,
} from './camera/CameraStrategies';
import { IndexedDbPhotoAlbumRepository } from './persistence/IndexedDbPhotoAlbumRepository';
import { LocalStorageBoothGuestRepository } from './persistence/LocalStorageBoothGuestRepository';

const photoAlbumRepository = new IndexedDbPhotoAlbumRepository();
const boothGuestRepository = new LocalStorageBoothGuestRepository();

export const photosContainer = {
  identifyGuestUseCase: new IdentifyGuestUseCase(boothGuestRepository),
  getChallengeBoardUseCase: new GetChallengeBoardUseCase(
    photoAlbumRepository,
    WEDDING_MISSIONS
  ),
  reviewAndSubmitPhotoUseCase: new ReviewAndSubmitPhotoUseCase(photoAlbumRepository),
  deleteGuestPhotoUseCase: new DeleteGuestPhotoUseCase(photoAlbumRepository),
  cameraCoordinator: new CameraCaptureCoordinator(
    [new ImageCaptureApiStrategy(), new CanvasVideoFrameStrategy()],
    new CanvasPhotoStampRenderer()
  ),
  stampRenderer: new CanvasPhotoStampRenderer(),
  guestRepository: boothGuestRepository,
};
