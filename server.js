require('dotenv').config()
const express = require('express')
const app = express()
const rowdy = require('rowdy-logger')
const rowdyRes = rowdy.begin(app)
const cryptoJS = require('crypto-js')

app.set('view engine', 'ejs')
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({ extended: false }))
app.use(require('cookie-parser')())
app.use(require('morgan')('tiny'))


const models = require('./models')

app.use(async (req, res, next) => {  
  if (req.cookies.userId) {
    const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, 'asdfasdf').toString(cryptoJS.enc.Utf8)

    console.log(decryptedId);
    
    const user = await models.user.findOne({
      where: {
        id: decryptedId
      }
    })

    res.locals.user = user
  } else {
    res.locals.user = null
  }

  next()
})

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/users', require('./controllers/usersController'))

app.listen(3000, () => {
  console.log('server started!');
  rowdyRes.print()
})
