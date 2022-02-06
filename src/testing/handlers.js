import { rest } from 'msw';

export const handlers = [
  rest.get('/api/set-csrf', (req, res, ctx) => {
    return res(
      ctx.json({
        details: "CSRF cookie set",
      })
    );
  }),
  rest.get('/api/test-auth', (req, res, ctx) => {
    return res(
      ctx.json({
        detail: "You're Authenticated",
      })
    );
  }),
  rest.get('/api/users/me', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        first_name: "Safe",
        last_name: "Tee Vision",
        email: "safe@teevision.com",
        account: 1,
      })
    );
  }),
];
