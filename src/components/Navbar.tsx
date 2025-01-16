"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="flex justify-between mx-auto items-center">
        <a href="#" className="uppercase font-bold tracking-wider ">
          Mystry Feedback
        </a>
        {session ? (
          <>
            <span className="capitalize font-normal tracking-wide">
              Hello, {user.username || user.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href={`/sign-in`}>
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
