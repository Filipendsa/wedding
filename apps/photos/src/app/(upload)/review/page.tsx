import React, { Suspense } from 'react';
import { PhotoReviewView } from '../../../features/photo-review/PhotoReviewView';

export default function ReviewPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#191412' }} />}>
      <PhotoReviewView />
    </Suspense>
  );
}
