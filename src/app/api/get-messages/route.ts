import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User & { _id: string };

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch Session!!",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "$messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User Not Found!!",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User's messages Fetched!!",
        messages: user[0]?.messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Something went wrong while fetching messages!!", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong while fetching the messages!!",
      },
      { status: 400 }
    );
  }
}
