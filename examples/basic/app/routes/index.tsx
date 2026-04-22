import { createRoute } from 'honox/factory';
import { Badge } from '../components/badge';
import { MetricCard } from '../components/metric-card';
import { SectionFrame } from '../components/section-frame';
import { TodoItem } from '../components/todo-item';
import TodoList from '../islands/todo-list';
import { sampleTodoPageData } from '../lib/data';
import { cardSurfaceStyle, palette, shellStyle } from '../lib/theme';

export default createRoute((c) => {
  const { subtitle, tasks, title } = sampleTodoPageData;
  const completeCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completeCount;

  return c.render(
    <main style={shellStyle}>
      <div style={{ display: 'grid', gap: '1.5rem', margin: '0 auto', maxWidth: '860px' }}>
        <header
          style={{
            ...cardSurfaceStyle,
            display: 'grid',
            gap: '1.25rem',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              alignItems: 'flex-start',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{
                  color: palette.accent,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  margin: '0 0 0.6rem',
                  textTransform: 'uppercase',
                }}
              >
                HonoX + Storybook example
              </p>
              <h1 style={{ fontSize: '2rem', lineHeight: 1.05, margin: '0 0 0.55rem' }}>{title}</h1>
              <p style={{ color: palette.muted, lineHeight: 1.6, margin: 0 }}>{subtitle}</p>
            </div>
            <Badge color={palette.success} label="1 island" />
          </div>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            }}
          >
            <MetricCard label="Tasks" value={tasks.length.toString()} />
            <MetricCard label="Active" value={activeCount.toString()} />
            <MetricCard label="Done" value={completeCount.toString()} />
          </div>
        </header>

        <SectionFrame
          aside={<Badge color={palette.accent} label={`${completeCount} done`} />}
          description="Server-rendered snapshot. The island below hydrates it on the client."
          title="Todo list"
        >
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {tasks.map((task) => (
              <TodoItem key={task.id} task={task} />
            ))}
          </div>
        </SectionFrame>

        <TodoList initialTasks={tasks} />
      </div>
    </main>,
    { title },
  );
});
