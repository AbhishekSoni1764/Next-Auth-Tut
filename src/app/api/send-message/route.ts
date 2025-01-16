import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  if (!username || !content) {
    return Response.json(
      {
        success: false,
        message: "All Fields are required!!",
      },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not Found!!",
        },
        { status: 401 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages!",
        },
        { status: 401 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully!!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Something went wrong while sending the message!!", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong while sending the message!!",
      },
      { status: 404 }
    );
  }
}
