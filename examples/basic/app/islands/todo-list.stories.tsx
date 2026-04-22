import type { Meta, StoryObj } from 'storybook-framework-hono-vite';
import { expect, userEvent, within } from 'storybook/test';
import { sampleTodoPageData } from '../lib/data';
import TodoList from './todo-list';

const meta = {
  component: TodoList,
  args: {
    initialTasks: sampleTodoPageData.tasks,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TodoList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText('Add a task'), 'Review release notes');
    await userEvent.click(canvas.getByRole('button', { name: 'Add task' }));
    await expect(canvas.getByText('Review release notes')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Active' }));
    await expect(canvas.getByText('Review release notes')).toBeInTheDocument();

    const taskCard = canvas.getByText('Review release notes').closest('article');

    if (!taskCard) {
      throw new Error('Newly added task card was not found.');
    }

    await userEvent.click(within(taskCard).getByRole('button', { name: 'Mark done' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Completed' }));
    await expect(canvas.getByText('Review release notes')).toBeInTheDocument();
  },
};
