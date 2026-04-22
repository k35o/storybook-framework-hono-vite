import type { Decorator, Preview } from 'storybook-framework-hono-vite';
import { palette } from '../app/lib/theme';

const withDarkShell: Decorator = (Story) => (
  <div
    style={{
      background: palette.panel,
      color: palette.text,
      fontFamily:
        '"IBM Plex Sans", "Segoe UI", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh',
      padding: '2rem',
    }}
  >
    <Story />
  </div>
);

const preview: Preview = {
  decorators: [withDarkShell],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'error',
    },
  },
};

export default preview;
