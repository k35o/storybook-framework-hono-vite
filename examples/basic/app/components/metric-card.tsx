import { palette } from '../lib/theme';

export interface MetricCardProps {
  label: string;
  value: string;
}

export const MetricCard = ({ label, value }: MetricCardProps) => {
  return (
    <section
      style={{
        background: 'rgba(15, 23, 42, 0.62)',
        border: `1px solid ${palette.border}`,
        borderRadius: '1rem',
        padding: '1rem 1.1rem',
      }}
    >
      <p style={{ color: palette.muted, fontSize: '0.82rem', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '1.7rem', fontWeight: 700, margin: '0.45rem 0 0' }}>{value}</p>
    </section>
  );
};
