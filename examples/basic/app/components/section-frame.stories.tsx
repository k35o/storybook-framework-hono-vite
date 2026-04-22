import type { Meta, StoryObj } from 'storybook-framework-hono-vite';
import { Badge } from './badge';
import { SectionFrame } from './section-frame';

const meta = {
  component: SectionFrame,
  args: {
    aside: <Badge color="#38bdf8" label="today" />,
    children: (
      <div style={{ color: '#94a3b8', display: 'grid', gap: '0.5rem' }}>
        <p style={{ margin: 0 }}>A reusable frame for small grouped content.</p>
        <p style={{ margin: 0 }}>Used for both the server snapshot and the interactive island.</p>
      </div>
    ),
    description: 'Shared container used across the simple TODO example.',
    title: 'Today list',
  },
} satisfies Meta<typeof SectionFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
