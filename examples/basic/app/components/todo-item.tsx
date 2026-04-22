import type { TodoItemData } from '../lib/data';
import { insetPanelStyle, palette } from '../lib/theme';
import { Badge } from './badge';

export interface TodoItemProps {
  onToggle?: () => void;
  task: TodoItemData;
}

export const TodoItem = ({ onToggle, task }: TodoItemProps) => {
  return (
    <article
      style={{
        ...insetPanelStyle,
        alignItems: 'flex-start',
        display: 'grid',
        gap: '0.85rem',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        padding: '1rem',
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            opacity: task.completed ? 0.72 : 1,
            textDecoration: task.completed ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </p>
        <p
          style={{
            color: palette.muted,
            fontSize: '0.86rem',
            lineHeight: 1.5,
            margin: '0.3rem 0 0',
          }}
        >
          {task.note}
        </p>
      </div>
      <div
        style={{
          alignItems: 'flex-end',
          display: 'grid',
          gap: '0.6rem',
          justifyItems: 'end',
        }}
      >
        <Badge
          color={task.completed ? palette.success : palette.warning}
          label={task.completed ? 'done' : 'active'}
        />
        {onToggle ? (
          <button
            onClick={onToggle}
            style={{
              background: task.completed ? 'transparent' : `${palette.accent}22`,
              border: `1px solid ${task.completed ? palette.border : `${palette.accent}77`}`,
              borderRadius: '999px',
              color: task.completed ? palette.text : '#e0f2fe',
              cursor: 'pointer',
              font: '600 0.82rem/1 inherit',
              padding: '0.65rem 0.9rem',
            }}
            type="button"
          >
            {task.completed ? 'Mark active' : 'Mark done'}
          </button>
        ) : null}
      </div>
    </article>
  );
};
