import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { resetAccountPassword, sendAccountOpeningMail } from "../utils/email";
import { role } from "../utils/role";
import { streamUpload } from "../utils/streamUpload";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const salt: any = await bcrypt.genSalt(10);
    const hash: any = await bcrypt.hash(password, salt);

    const value = crypto.randomBytes(32).toString("hex");

    const token = jwt.sign(value, "secret");

    const user = await prisma.authModel.create({
      data: {
        name,
        password: hash,
        email,
        token,
        role:role.USER
      },
    });
    const tokenID = jwt.sign({ id: user.id }, "secret");
    sendAccountOpeningMail(user, tokenID).then(()=>{
      console.log("sent mail")
    });
    return res.status(201).json({
      message: "User created successfully",
      data: user,
      token:tokenID
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error registering user",
      data: error.message,
    });
  }
};

export const registerLawyer= async(req:Request, res:Response)=>{
  try {
    const {name, password, email, secret }= req.body;

    const salt= await bcrypt.genSalt(10)
    const hash= await bcrypt.hash(password, salt)
    const value=  crypto.randomBytes(32).toString("hex")
    const token=  jwt.sign(value, "ajLaw")

    if (secret === "law") {
      const user = await prisma.authModel.create({
        data:{
          name,
          email,
          password:hash,
          token,
          role: role.ADMIN,
        }
      })

      const tokenID = jwt.sign({ id: user.id }, "secret");
      sendAccountOpeningMail(user, tokenID).then(()=>{
        console.log("sent mail")
      });

      return res.status(201).json({
        message: "Lawyer Account created successfully",
        data: user
      })
    }else{
      return res.status(404).json({
        message: "Invalid lawyerSecret"
      })
    }
  } catch (error:any) {
    return res.status(400).json({message: error.message})
  }
}

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { email },
    });
    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        if (user.verified && user.token === "") {
          const token = jwt.sign({ id: user.id }, "secret");

          req.headers.authorization = `Bearer ${token}`;

          return res.status(201).json({
            message: "success",
            data: token,
          });
        } else {
          return res.status(404).json({
            message: "veriify your email address",
          });
        }
      } else {
        return res.status(404).json({
          message: "invalid password",
        });
      }
    } else {
      return res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error sign in user",
      data: error.message,
    });
  }
};

export const signInLawyer = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const user = await prisma.authModel.findUnique({
        where: { email },
      });
      if (user) {
        const check = await bcrypt.compare(password, user.password);
        if (check) {
          if (user.verified && user.token === "") {
            const token = jwt.sign({ id: user.id }, "secret");
  
            req.headers.authorization = `Bearer ${token}`;
  
            return res.status(201).json({
              message: "success",
              data: token,
            });
          } else {
            return res.status(404).json({
              message: "veriify your email address",
            });
          }
        } else {
          return res.status(404).json({
            message: "invalid password",
          });
        }
      } else {
        return res.status(404).json({
          message: "user not found",
        });
      }
    } catch (error: any) {
      return res.status(404).json({
        message: "Error sign in user",
        data: error.message,
      });
    }
  };

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const getID: any = jwt.verify(token, "secret", (err, payload: any) => {
      if (err) {
        return err;
      } else {
        return payload;
      }
    });

    const user = await prisma.authModel.update({
      where: { id: getID?.id },
      data: {
        verified: true,
        token: "",
      },
    });
    return res.status(201).json({
      message: "verification successful",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { email },
    });

    if (user?.verified && user?.token === "") {
      const token = jwt.sign({ id: user.id }, "secret");

   const pass =   await prisma.authModel.update({
        where: { id: user.id },
        data: {
          token,
        },
      });
      resetAccountPassword(user, token).then(()=>{
        console.log("sent password reset")
      })
      return res.status(200).json({
        message: "success",
        data: pass,
      });
    } else {
      return res.status(404).json({
        message: "you can't reset your password",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error reseting password",
      data: error.message,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const getID: any = jwt.verify(token, "secret", (err, payload: any) => {
      if (err) {
        return err;
      } else {
        return payload;
      }
    });

    const user = await prisma.authModel.findUnique({
      where: { id: getID.id },
    });
    if (user?.verified && user.token !== "") {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
    const pass =  await prisma.authModel.update({
        where: { id: user.id },
        data: {
          password: hash,
          token: ""
        },
      });
      return res.status(201).json({
        message: "success",
        data: pass,
      });
    } else {
      return res.status(404).json({
        message: "error ",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const user = await prisma.authModel.findMany({});
    return res.status(200).json({
      message: "Success",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await prisma.authModel.delete({
      where: { id: userID },
    });
    return res.status(201).json({
      message: "User deleted successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error deleting user",
      data: error.message,
    });
  }
};

export const updateAvatar =async(req:any, res:Response)=>{
  try {
    const {userID} = req.params
    const {secure_url, public_id}:any = await streamUpload(req)

    const user =await prisma.authModel.update({
      where:{id:userID},
      data:{
        avatar:secure_url, avatarID:public_id
      }
    })
    return res.status(201).json({
      message:"Success",
      data:user
    })
  } catch (error:any) {
    return res.status(404).json({
      message:"Error updating avatar",
      data:error.message
    })
  }
}

// export const firstAccountVerification = async (req: Request, res: Response) => {
//   try {
//     const { secretKey } = req.body;
//     const { token } = req.params;

//     jwt.verify(token, "secret", async (error, payload: any) => {
//       if (error) {
//         throw new Error();
//       } else {
//         const account = await prisma.authModel.findUnique({
//           where: { id: payload.id },
//         });

//         if (account?.secretKey === secretKey) {
//           sendSecondEmail(account).then(() => {
//             console.log("Mail Sent...");
//           });

//           return res.status(200).json({
//             message: "PLease to verify your Account",
//           });
//         } else {
//           return res.status(404).json({
//             message: "Error with your Token",
//           });
//         }
//       }
//     });
//   } catch (error) {
//     return res.status(404).json({
//       message: "Error",
//     });
//   }
// };