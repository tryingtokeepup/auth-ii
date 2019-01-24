require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs'); // added
const jwt = require('jsonwebtoken');
const knexConfig = require('../knexfile.js');

const server = express();

const db = knex(knexConfig.development);

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
  res.send('hopefully everyone is up in here, up in here.');
});

server.post('/register', (req, res) => {
  const userInfo = req.body;
  // userinfo consists of username, name, and password
  const hash = bcrypt.hashSync(userInfo.password, 12);

  userInfo.password = hash;

  db('users')
    .insert(userInfo)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.status(500).json(err));
});

///////=============== Middleware ===============///////
// might want to clean up the routes and put these functions into the dbHelpers in the future

function makeToken(user) {
  //// i wonder if this will conflict with the above information!
  const payload = {
    username: user.username,
    name: user.name,
    department: [
      'Department of Merrymaking',
      'Ministry of Truth',
      'Ministry of Thought'
    ]
  };
  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: '1000m'
  };
  return jwt.sign(payload, secret, options);
}

function checkDepartment(department) {
  return function(req, res, next) {
    if (req.decodedToken.department.includes(department)) {
      next();
    } else {
      res.status(403).json({
        message: `sorry yo, you need to be in ${department} to access this site.`
      });
    }
  };
}

server.post('/login', (req, res) => {
  const creds = req.body;
  console.log(creds);

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = makeToken(user);
        res.status(200).json({ message: `welcome ${user.name}`, token });
      } else {
        res.status(401).json({ you: 'shall not pass!!' });
      }
    })
    .catch(err => res.status(500).json(err));
});

/// this works as our "lock", and will keep those without the proper token from popping in.
function lock(req, res, next) {
  // if the use is logged in next()
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'invalid token. try again?' });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'no token provided! get a token, yo!' });
  }
}

server.get(
  '/users',
  lock,
  checkDepartment('Department of Merrymaking'),
  async (req, res) => {
    const users = await db('users').select('id', 'username', 'name');

    res.status(200).json({ users, token: req.decodedToken });
  }
);

server.get('/users/me', lock, async (req, res) => {
  console.log(req.decodedToken);
  const user = await db('users')
    .where({ username: req.decodedToken.username })
    .first();

  res.json(user);
});

server.get('/users/:id', lock, async (req, res) => {
  const user = await db('users')
    .where({ id: req.params.id })
    .first();
  if (!user) {
    res.status(401).json({ message: 'sorry man, no one there.' });
  } else {
    res.status(200).json(user);
  }
});

module.exports = server;

//checkDepartment('super sexy dude'),
