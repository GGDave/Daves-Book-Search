const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function ({ req }) {
    
    let token = req.body.token || req.query.token || req.headers.authorization;

    console.log('Headers:', req.headers);
    console.log('Received token:', token);
    
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    
    if (!token) {
      return req;
    }

    try {
      
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('Decoded token:', data);

      req.user = data;

    } catch (err) {
      console.log('Invalid token', err);
    }

   
    return req;
  },
};
