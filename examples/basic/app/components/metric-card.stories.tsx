import type { Meta, StoryObj } from 'storybook-framework-hono-vite';
import { MetricCard } from './metric-card';

const meta = {
  component: MetricCard,
  args: {
    label: 'Done',
    value: '2',
  },
} satisfies Meta<typeof MetricCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
