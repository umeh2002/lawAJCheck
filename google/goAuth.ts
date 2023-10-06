import passport from "passport";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID =
  "72356347044-ift4l94ujfbg4uhmrmcs78u18l4ucrrn.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3678/google/callback",
      // callbackURL: environemtVariable.CALLBACKURL,
      passReqToCallback: true,
    },

    async (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) => {
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
