import { resend } from "@/lib/emailService";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationCode(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Msytry Verification Code!!",
      react: VerificationEmail({ username, otp: verificationCode }),
    });

    return {
      success: true,
      message: "Verification Email successfully sent!!",
    };
  } catch (error) {
    console.error(
      "Something went wrong while sending Verification Code!!",
      error
    );
    return {
      success: false,
      message: "Failed to send Verification Code!!",
    };
  }
}
