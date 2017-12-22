const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });

});

app.post('/api/login', (req, res) => {
  //Mock User
  const user = {
    id: 1,
    username: 'Imran',
    email: 'comunit@live.com'
  }

  jwt.sign({
    user: user
  }, 'secretkey', {
    expiresIn: '30s'
  }, (err, token) => {
    res.json({
      token
    });
  });
})

//format of token
//authorization: Bearer <access_token>

//verify Token
function verifyToken(req, res, next) {
  //Get auth header value
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearertToken = bearer[1];
    // set the token
    req.token = bearertToken;
    //next middleware
    next();
  } else {
    // forbidden
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log('server started at 5000'));