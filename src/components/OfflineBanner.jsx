import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="offline-banner" role="alert">
      ⚽ Você está offline. Seus palpites continuam salvos neste aparelho.
    </div>
  );
}
