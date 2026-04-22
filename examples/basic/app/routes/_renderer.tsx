import { jsxRenderer } from 'hono/jsx-renderer';
import { HasIslands } from 'honox/server';

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {title ? <title>{title}</title> : null}
        <HasIslands>
          <script async src="/app/client.ts" type="module" />
        </HasIslands>
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
});
