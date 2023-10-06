import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response) => {
  try {
    const { userID, lawID } = req.params;
    const { comment } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { id: userID },
    });
    const law = await prisma.lawModel.findUnique({
      where: { id: lawID },
      include: { comments: true },
    });
    if (user && law) {
      const message = await prisma.commentModel.create({
        data: {
          comment,
          userID,
          lawID,
        },
      });
      law.comments.push(message);

      return res.status(201).json({
        message: "created comment successfully",
        data: law.comments,
      });
    } else {
      return res.status(404).json({
        message: "no comments",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating comment",
      data: error.message,
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentID, userID } = req.params;
    const user = await prisma.authModel.findUnique({
      where: { id: userID },
    });

    const comment = await prisma.commentModel.findUnique({
      where: { id: commentID },
    });

    if (user?.id === comment?.userID) {
      const commented = await prisma.commentModel.delete({
        where: { id: commentID },
      });
      return res.status(200).json({
        message: "Comment deleted",
        data: commented,
      });
    } else {
      return res.status(404).json({
        message: "you cannot delete this comment",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error deleting comment",
      data: error.message,
    });
  }
};

export const viewAllComments =async(req: Request, res: Response)=>{
try {
  const commented = await prisma.commentModel.findMany({
    include:{reply:true}
  })

  return res.status(200).json({
    message:"success",
    data:commented
  })
} catch (error:any) {
  return res.status(404).json({
    message:"error",
    data:error.message
  })
}
}
