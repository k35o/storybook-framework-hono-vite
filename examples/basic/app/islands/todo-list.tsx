import { useState } from 'hono/jsx';
import { Badge } from '../components/badge';
import { SectionFrame } from '../components/section-frame';
import { TodoItem } from '../components/todo-item';
import type { TodoItemData } from '../lib/data';
import { insetPanelStyle, palette } from '../lib/theme';

type FilterKey = 'active' | 'all' | 'completed';

export interface TodoListProps {
  initialTasks: TodoItemData[];
}

const filterLabels: Record<FilterKey, string> = {
  active: 'Active',
  all: 'All',
  completed: 'Completed',
};

export default function TodoList({ initialTasks }: TodoListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draftTitle, setDraftTitle] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const completeCount = tasks.filter((task) => task.completed).length;
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const addTask = () => {
    const normalizedTitle = draftTitle.trim();
    if (normalizedTitle.length === 0) return;

    setTasks((current) => [
      {
        completed: false,
        id: `task-${Date.now()}`,
        note: 'Added from the interactive island.',
        title: normalizedTitle,
      },
      ...current,
    ]);
    setDraftTitle('');
    setFilter('all');
  };

  const toggleTask = (taskId: string) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  };

  const handleDraftInput = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement | null;
    setDraftTitle(target?.value ?? '');
  };

  return (
    <SectionFrame
      aside={<Badge color={palette.accent} label={`${completeCount} done`} />}
      description="Add a task, switch filters, and toggle completion inside one small Hono island."
      title="Todo list island"
    >
      <div
        style={{
          alignItems: 'end',
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
        }}
      >
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: palette.muted, fontSize: '0.82rem', fontWeight: 600 }}>
            Add a task
          </span>
          <input
            aria-label="Add a task"
            onInput={handleDraftInput}
            placeholder="Review the docs example"
            style={{
              background: '#0b1425',
              border: `1px solid ${palette.border}`,
              borderRadius: '0.9rem',
              color: palette.text,
              font: 'inherit',
              outline: 'none',
              padding: '0.85rem 0.95rem',
            }}
            type="text"
            value={draftTitle}
          />
        </label>
        <button
          onClick={addTask}
          style={{
            background: `${palette.accent}22`,
            border: `1px solid ${palette.accent}77`,
            borderRadius: '999px',
            color: '#e0f2fe',
            cursor: 'pointer',
            font: '700 0.84rem/1 inherit',
            padding: '0.8rem 1rem',
          }}
          type="button"
        >
          Add task
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {(Object.keys(filterLabels) as FilterKey[]).map((option) => {
          const isActive = option === filter;
          return (
            <button
              key={option}
              onClick={() => setFilter(option)}
              style={{
                background: isActive ? `${palette.accent}22` : '#0b1425',
                border: `1px solid ${isActive ? `${palette.accent}77` : palette.border}`,
                borderRadius: '999px',
                color: isActive ? '#e0f2fe' : palette.muted,
                cursor: 'pointer',
                font: '600 0.84rem/1 inherit',
                padding: '0.7rem 0.9rem',
              }}
              type="button"
            >
              {filterLabels[option]}
            </button>
          );
        })}
      </div>

      <p style={{ color: palette.muted, margin: 0 }}>
        {`${completeCount} of ${tasks.length} tasks complete`}
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {visibleTasks.map((task) => (
          <TodoItem key={task.id} onToggle={() => toggleTask(task.id)} task={task} />
        ))}

        {visibleTasks.length === 0 ? (
          <div
            style={{
              ...insetPanelStyle,
              color: palette.muted,
              padding: '1rem',
            }}
          >
            No tasks match the current filter.
          </div>
        ) : null}
      </div>
    </SectionFrame>
  );
}
