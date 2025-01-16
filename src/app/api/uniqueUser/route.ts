import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/models/User.model";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    if (!queryParams) {
      return Response.json(
        {
          success: false,
          message: "No Query params Recieved!!",
        },
        { status: 401 }
      );
    }

    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log("result for zod", result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid Query Parameters!!",
        },
        { status: 405 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken!!",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is Unique!!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while Checking Unique User!!", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking unique user!!",
      },
      { status: 400 }
    );
  }
}
