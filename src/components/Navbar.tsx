"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="flex justify-between mx-auto items-center">
        <Link className="uppercase font-bold tracking-wider" href={"/"}>
          Mystry Feedback
        </Link>
        {session ? (
          <div className="gap-5 flex justify-center items-center">
            <span className="capitalize font-normal tracking-wide">
              <Link
                href={`/u/${user.username}`}
                className="flex gap-5 justify-center items-center"
              >
                <Image
                  src="/profile.png"
                  alt="profile"
                  height={40}
                  width={40}
                />{" "}
                {user.username || user.email}
              </Link>
            </span>
            {session && (
              <Button
                onClick={() => router.replace("/dashboard")}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Dashboard
              </Button>
            )}
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </div>
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
