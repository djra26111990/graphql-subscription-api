import jwt from 'jsonwebtoken'
const APP_SECRET = 'secretjwt-graphql';

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

function getUserEmail(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { email } = getTokenPayload(token);
      return email;
    }
  } else if (authToken) {
    const { email } = getTokenPayload(authToken);
    return email;
  }

  throw new Error('Not authenticated');
}

const utils = {
  APP_SECRET,
  getUserEmail
}

export default utils