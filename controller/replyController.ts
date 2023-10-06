import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createReply = async (req: Request, res: Response) => {
  try {
    const { userID, commentID } = req.params;
    const { reply } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { id: userID },
    });
    const comment = await prisma.commentModel.findUnique({
      where: { id: commentID },
      include: { reply: true },
    });
    if (user && comment) {
      const replied = await prisma.replyModel.create({
        data: {
          reply,
          commentID,
          userID,
        },
      });
      comment.reply.push(replied)
      return res.status(201).json({
        message: "success",
        data: replied,
      });
    } else {
        return res.status(404).json({
            message:"cannot create reply"
        })
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error creating reply",
      data: error.message,
    });
  }
};

export const viewReply=async(req:Request,res:Response)=>{
    try {
        const {userID, commentID} =req.params

        const user = await prisma.authModel.findUnique({
            where: { id: userID },
          });
          const comment = await prisma.commentModel.findUnique({
            where: { id: commentID },
            include: { reply: true },
          });
          
          if (user && comment) {
            const replied = await prisma.replyModel.findMany({})

            return res.status(200).json({
                message:"can see all replies",
                data:replied
            })
          } else {
            return res.status(404).json({
                message:"cannot see all replies"
            })
          }
    } catch (error:any) {
        return res.status(404).json({
            message:"error",
            data:error.message
        })
    }
}