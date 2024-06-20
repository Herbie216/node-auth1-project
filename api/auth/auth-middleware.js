const User = require('../users/users-model');

function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({ status: 401, message: 'you shall not pass!' })
  }
}

async function checkUsernameFree(req, res, next) {
  const { username } = req.body;
  const user = await User.findBy({ username });
  if (user) {
    res.status(422).json({ message: "username taken" });
  } else {
    next();
  }
}

async function checkUsernameExists(req, res, next) {
  const { username } = req.body;
  const user = await User.findBy({ username });
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}

function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if (!password || password.length < 3) {
    res.status(422).json({ message: "password must be longer than 3 chars" });
  } else {
    next();
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
};
