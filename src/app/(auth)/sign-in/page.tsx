"use client";
import { useSession, signIn, signOut } from "next-auth/react";
const SignInPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed In as {session.user.email} <br />
        <button
          className="bg-orange-600 px-3 py-1 m-5 rounded-lg"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </>
    );
  }

  return (
    <>
      Not Signed In <br />
      <button
        className="bg-orange-600 px-3 py-1 m-5 rounded-lg"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    </>
  );
};

export default SignInPage;
