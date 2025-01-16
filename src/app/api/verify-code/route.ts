import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    if (!username || !code) {
      return Response.json(
        {
          success: false,
          message: "Enter all Fields!!",
        },
        { status: 401 }
      );
    }

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not Found!!",
        },
        { status: 401 }
      );
    }

    const isCodeValid = user?.verificationCode === code;
    const isExpiryValid = new Date(user?.verificationCodeExpiry) > new Date();

    if (isCodeValid && isExpiryValid) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User is Verified Successfully!!",
        },
        { status: 200 }
      );
    } else if (!isExpiryValid) {
      return Response.json(
        {
          success: false,
          message: "User's Code is Expired!!",
        },
        { status: 401 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "User's Code Invalid!!",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error while verifying user!!", error);
    return Response.json(
      {
        success: false,
        message: "Error while verifying user!!",
      },
      { status: 400 }
    );
  }
}
