export const palette = {
  accent: '#38bdf8',
  border: '#243146',
  danger: '#f97316',
  muted: '#94a3b8',
  panel: '#111c33',
  panelSoft: 'rgba(8, 15, 28, 0.6)',
  success: '#22c55e',
  text: '#e2e8f0',
  warning: '#f59e0b',
};

export const shellStyle = {
  background:
    'radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 32%), linear-gradient(180deg, #08111f 0%, #0b1324 52%, #0d1728 100%)',
  color: palette.text,
  fontFamily:
    '"IBM Plex Sans", "Segoe UI", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  padding: '2rem',
};

export const cardSurfaceStyle = {
  background: palette.panel,
  border: `1px solid ${palette.border}`,
  borderRadius: '1.25rem',
  boxShadow: '0 24px 80px rgba(15, 23, 42, 0.24)',
};

export const insetPanelStyle = {
  background: palette.panelSoft,
  border: `1px solid ${palette.border}`,
  borderRadius: '1rem',
};

export const makePillStyle = (color: string) => ({
  alignItems: 'center',
  background: `${color}22`,
  border: `1px solid ${color}55`,
  borderRadius: '999px',
  color,
  display: 'inline-flex',
  fontSize: '0.75rem',
  fontWeight: 700,
  gap: '0.35rem',
  letterSpacing: '0.04em',
  padding: '0.35rem 0.65rem',
  textTransform: 'uppercase' as const,
});
