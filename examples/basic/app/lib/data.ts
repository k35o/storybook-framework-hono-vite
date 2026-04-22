export interface TodoItemData {
  completed: boolean;
  id: string;
  note: string;
  title: string;
}

export interface TodoPageData {
  subtitle: string;
  tasks: TodoItemData[];
  title: string;
}

export const sampleTodoPageData: TodoPageData = {
  subtitle: 'A small Hono page with one interactive island for daily tasks.',
  tasks: [
    {
      completed: false,
      id: 'plan-storybook-example',
      note: 'Keep the example small enough to scan in one sitting.',
      title: 'Plan the Storybook example',
    },
    {
      completed: true,
      id: 'wire-hono-entrypoint',
      note: 'Render the initial HTML from the Hono route.',
      title: 'Wire the Hono entrypoint',
    },
    {
      completed: false,
      id: 'add-island-mount',
      note: 'Use an island component to hydrate just the interactive part.',
      title: 'Add the island mount',
    },
    {
      completed: true,
      id: 'write-ui-stories',
      note: 'Keep primitive stories available in Storybook.',
      title: 'Write UI stories',
    },
  ],
  title: 'Today list',
};
