import jwt from 'jsonwebtoken';

export function jwtSign(user) {
  const payload = {
    email: user.email,
    id: user.id,
    scopes: {
      users: {
        actions: ['create', 'read', 'update'],
      },
    },
  };

  return jwt.sign(payload, 'secret');
}

export function requireScope(scopes) {
  return (req, res, next) => {
    const hasScopes = scopes.every((scope) => {
      return req.token.indexOf(scope) > -1;
    });

    if (!hasScopes) { res.send(401); }

    next();
  };
}
