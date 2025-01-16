import { resend } from "@/lib/emailService";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationCode(
  username: string,
  email: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    // Debug raw input
    console.log("Raw email input:", email);
    console.log("Type of email:", typeof email);

    // Sanitize and validate email
    const sanitizedEmail = email.trim().replace(/\s+/g, "");
    console.log("Sanitized email:", sanitizedEmail);

    // Debug character codes
    console.log("Email characters and their codes:");
    [...sanitizedEmail].forEach((char, index) => {
      console.log(`Index ${index}: '${char}' (Code: ${char.charCodeAt(0)})`);
    });

    if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      throw new Error("Invalid email format");
    }

    console.log("Sending email to:", sanitizedEmail);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: sanitizedEmail,
      subject: "Verification Code!!",
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
