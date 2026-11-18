export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatRelativeTimestamp(unixSecondsStr: string): string {
  const seconds = Number(unixSecondsStr);
  if (!Number.isFinite(seconds) || seconds <= 0) return 'Recent';

  const date = new Date(seconds * 1000);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatUtcTime(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function computePercentage(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 1000) / 10);
}

