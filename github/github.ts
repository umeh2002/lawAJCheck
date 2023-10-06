import passport from "passport";
import GitHub from "passport-github2";
import env from "dotenv"

env.config()

const GitHubStrategy = GitHub.Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: "1b397d15caf372a81bbc",
      clientSecret: "0ee181027315268ccbb0db3310fbde9319d1be1d",
      callbackURL:"https://ajlawtesting.onrender.com/github/callback",
    },
    function (accessToken:any, refreshToken:any, profile:any, done:any) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user!);
});