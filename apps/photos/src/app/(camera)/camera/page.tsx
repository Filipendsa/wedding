import React, { Suspense } from 'react';
import { CameraBoothView } from '../../../features/camera-booth/CameraBoothView';

export default function CameraPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#000000' }} />}>
      <CameraBoothView />
    </Suspense>
  );
}
