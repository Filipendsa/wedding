import React from 'react';
import { Navbar } from '../../features/wedding-story/Navbar';
import { GuestPanelView } from '../../features/guest-panel/GuestPanelView';

export default function GuestPanelPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FBF9F5' }}>
      <Navbar />
      <GuestPanelView />
    </main>
  );
}
