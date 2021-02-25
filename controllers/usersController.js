const router = require('express').Router()
const AES = require('crypto-js/aes')
const bcrypt = require('bcrypt')
const models = require('../models')

router.get('/new', (req, res) => {
  res.render('users/new')
})

router.post('/', async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)

  const user = await models.user.create({
    email: req.body.email,
    password: hashedPassword
  })

  const encryptedId = AES.encrypt(user.id.toString(), 'asdfasdf').toString()
  res.cookie('userId', encryptedId)
  res.redirect('/')
})

router.get('/login', (req, res) => {
  res.render('users/login', { errors: null })
})

router.post('/login', async (req, res) => {
  const user = await models.user.findOne({
    where: {
      email: req.body.email
    }
  })

  if (bcrypt.compareSync(req.body.password, user.password)) {
      const encryptedId = AES.encrypt(user.id.toString(), 'asdfasdf').toString()
      res.cookie('userId', encryptedId)
      res.redirect('/')
  } else {
    res.render('users/login', { errors: "Invalid email/password" })
  }
})

router.get('/logout', (req, res) => {
  // const encryptedZero = AES.encrypt(0, 'asdfasdf').toString()
  
  res.clearCookie('userId')
  res.redirect('/')
})

router.get('/profile', async (req, res) => {
  if (!res.locals.user) {
    res.redirect('/users/login')
    return
  }

  res.render('users/profile')  
})

module.exports = router