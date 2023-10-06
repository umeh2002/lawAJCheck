import express, { Application, Response,Request } from "express";
import { main } from "./main";
import passport from "passport";
import cors from "cors";
import "./github/github"
import "./google/goAuth"
import session from "express-session"

const app: Application = express();
const port: number = 3678;
main(app);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user!);
});


app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());


app.get("/google", (req: Request, res: Response) => {
  res.send(`<a href= "/veri/google">Authenicate with google</a>`);
});

app.get(
  "/veri/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/Home/",
    failureRedirect: "/google/callback/failure",
  })
);

app.get("/google/callback/protect", (req: any, res: any) => {
  return res.send(`hello ${req?.user?.displayName}`);
});
app.get("/google/callback/failure", (req, res) => {
  return res.send("failed to authnticate");
});

app.get("/github", (req: Request, res: Response) => {
  res.send(`<a href= "/veri/github">Authenicate with github</a>`);
});

app.get(
  "/veri/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "http://localhost:3000/Home/",
    failureRedirect: "/github/callback/failure",
  })
);

const server = app.listen(port, () => {
  console.log();
  console.log(`server is listening on ${port}`);
});

process.on("uncaughtException", (reason: any) => {
  console.log("server is shutting down due to uncaught exception");
  console.log(reason)
});

process.on("unhandledRejection", (error: any) => {
  console.log("server is shutting down due to unhandled rejection");
  console.log(error)
  server.close(() => {
    process.exit(1);
  });
});
