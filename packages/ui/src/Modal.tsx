'use client';

import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, maxWidth = '480px', children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes wendingModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes wendingSheetUp {
          from { opacity: 0; transform: translate3d(0, 32px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .wending-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background-color: rgba(44, 38, 35, 0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0;
          overflow-y: auto;
          animation: wendingModalFade 200ms ease-out;
        }
        .wending-modal-sheet {
          background-color: #FBF9F5;
          border-radius: 24px 24px 0 0;
          padding: 18px 20px calc(26px + env(safe-area-inset-bottom, 0px));
          width: 100%;
          position: relative;
          border: 1px solid #DFD5C6;
          box-shadow: 0 -12px 44px rgba(20, 16, 14, 0.28);
          max-height: 92dvh;
          overflow-y: auto;
          animation: wendingSheetUp 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wending-modal-handle {
          width: 38px;
          height: 4px;
          border-radius: 999px;
          background-color: #DFD5C6;
          margin: 0 auto 14px;
        }
        @media (min-width: 640px) {
          .wending-modal-backdrop {
            align-items: center;
            padding: 16px;
          }
          .wending-modal-sheet {
            border-radius: 20px;
            padding: 32px 26px;
            box-shadow: 0 24px 60px rgba(20, 16, 14, 0.3);
            max-height: 92vh;
          }
          .wending-modal-handle {
            display: none;
          }
        }
      `}</style>
      <div
        className="wending-modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) {
            onClose();
          }
        }}
      >
        <div className="wending-modal-sheet" style={{ maxWidth }}>
          <div className="wending-modal-handle" aria-hidden="true" />
          {children}
        </div>
      </div>
    </>
  );
}
