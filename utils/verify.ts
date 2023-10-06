import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const verification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const realToken = token.split(" ")[1];
      if (realToken) {
        jwt.verify(realToken, "secret", (err, payload:any) => {
          if (err) {
            return res.status(404).json({
              message: "error",
              data: err,
            });
          } else {
           if (payload.email ==="") {
            next()
           }else{
            return res.status(404).json({
                message: "you don't have permission",
              });
           }
          }
        });
      } else {
        return res.status(404).json({
          message: "error",
        });
      }
    } else {
      return res.status(404).json({
        message: "error, check your token",
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "error",
    });
  }
};
