import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";
import helmet from "helmet";
import auth from "./router/authRouter";
import law from "./router/lawRouter";
import comment from "./router/commentRouter";
import reply from "./router/replyRouter";

export const main = (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(helmet());
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.static(`${__dirname}/css`));

  app.get("/",(req, res)=>{
    try {
      return res.status(200).json({
        message:"welcome to law api"
      })
    } catch (error:any) {
      return res.status(404).json({
        message:"error",
      })
    }
  })

  app.use("/api", auth);
  app.use("/api", law);
  app.use("/api", comment);
  app.use("/api", reply);
};
