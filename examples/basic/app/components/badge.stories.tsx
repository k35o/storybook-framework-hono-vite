import type { Meta, StoryObj } from 'storybook-framework-hono-vite';
import { Badge } from './badge';

const meta = {
  component: Badge,
  args: {
    color: '#38bdf8',
    label: 'today',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Done: Story = {
  args: {
    color: '#22c55e',
    label: 'done',
  },
};
