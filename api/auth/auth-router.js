const router = require('express').Router();
const User = require('../users/users-model');
const bcrypt = require('bcryptjs');
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware');

router.post('/register', checkPasswordLength, checkUsernameFree, (req, res, next) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  User.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});


router.post('/login', checkUsernameExists, (req, res, next) => {
  const { password } = req.body;
  if (bcrypt.compareSync(password, req.user.password)) {
    req.session.user = req.user;
    res.json({ message: `Welcome ${req.user.username}` });
  } else {
    next({ status: 401, message: 'Invalid Credentials' });
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        next(err);
      } else {
        res.json({ message: 'logged out' });
      }
    });
  } else {
    res.json({ message: 'no session' });
  }
});

module.exports = router;
