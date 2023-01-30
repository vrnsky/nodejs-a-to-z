const passport = require('koa-passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

// Настройка стратегии аутентификации через Google
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy(
    {
      userProfileURL: 'https://openidconnect.googleapis.com/v1/userinfo',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/v1/oauth_verification/google`
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const email = profile._json.email
        done(null, { email })
      } catch (err) {
        return done(err, null)
      }
    }
  ))
}

// Формирование сведений о пользователе, которые будут сохранены в сессии
passport.serializeUser(function (user, done) {
  done(null, user)
})

// Восстановление сведений о пользователе из сессии
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

module.exports = passport
