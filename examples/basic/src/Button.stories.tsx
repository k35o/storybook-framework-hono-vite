import type { Meta, StoryObj } from 'storybook-framework-hono-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from './Button';

const meta = {
  component: Button,
  args: {
    initialCount: 2,
    label: 'Clicked',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await expect(button).toHaveTextContent('Clicked');
    await expect(button).toHaveTextContent('2');

    await userEvent.click(button);

    await expect(button).toHaveTextContent('3');
  },
};

export const LargeCount: Story = {
  args: {
    initialCount: 42,
    label: 'Count',
  },
};
