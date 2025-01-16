import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch Session!!",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
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
        message: "User is Now Accepting messages!!",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Something went wrong while updated user message acceptance!!",
      error
    );
    return Response.json(
      {
        success: false,
        message: "Something went wrong while updated user message acceptance!!",
      },
      { status: 400 }
    );
  }
}

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

  try {
    const userById = await UserModel.findById(user._id);

    if (!userById) {
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
        message: "User status fetched successfully!!",
        isAcceptingMessages: userById.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Something went wrong while fetching acceptance!!", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong while fetching acceptance!!",
      },
      { status: 400 }
    );
  }
}
