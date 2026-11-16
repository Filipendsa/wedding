import React, { Suspense } from 'react';
import { WelcomeLobbyView } from '../features/guest-welcome/WelcomeLobbyView';

export default function PhotoBoothHomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#FBF9F5' }} />}>
      <WelcomeLobbyView />
    </Suspense>
  );
}
