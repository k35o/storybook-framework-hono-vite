import type { Child } from 'hono/jsx';
import { cardSurfaceStyle, palette } from '../lib/theme';

export interface SectionFrameProps {
  aside?: Child;
  children: Child;
  description?: string;
  title: string;
}

export const SectionFrame = ({ aside, children, description, title }: SectionFrameProps) => {
  return (
    <section
      style={{
        ...cardSurfaceStyle,
        display: 'grid',
        gap: '1rem',
        padding: '1.25rem',
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{title}</h2>
          {description ? (
            <p style={{ color: palette.muted, fontSize: '0.88rem', margin: '0.3rem 0 0' }}>
              {description}
            </p>
          ) : null}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
};
