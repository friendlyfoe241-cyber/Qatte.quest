import React, { useEffect } from 'react';

interface AntiCheatWrapperProps {
  isActive: boolean;
  onViolation: (reason: string) => void;
  children: React.ReactNode;
}

export function AntiCheatWrapper({ isActive, onViolation, children }: AntiCheatWrapperProps) {
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onViolation("Tab was minimized or switched.");
      }
    };

    const handleBlur = () => {
      onViolation("Window focus was lost. Return to the quiz immediately.");
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation("Copying text is not allowed during the quiz.");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation("Pasting text is not allowed during the quiz.");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onViolation("Right-clicking is disabled during the quiz.");
    };

    // Note: In an iFrame environment like AI Studio, interacting with the parent
    // window (like the chat) will trigger a blur event. We keep it strictly active here
    // for demonstration purposes of the anti-cheat.
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isActive, onViolation]);

  return <>{children}</>;
}
