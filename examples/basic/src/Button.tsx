import { useState } from 'hono/jsx/dom';

export interface ButtonProps {
  initialCount?: number;
  label: string;
}

export const Button = ({ initialCount = 0, label }: ButtonProps) => {
  const [count, setCount] = useState(initialCount);

  return (
    <button
      onClick={() => setCount((current) => current + 1)}
      style={{
        border: '1px solid #111827',
        borderRadius: '999px',
        cursor: 'pointer',
        display: 'inline-flex',
        font: '600 14px/1.2 ui-sans-serif, system-ui, sans-serif',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
      }}
      type="button"
    >
      <span>{label}</span>
      <span>{count}</span>
    </button>
  );
};
