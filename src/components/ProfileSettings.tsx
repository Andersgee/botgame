import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const DISCORD_INVITE_LINK = "https://discord.gg/k2Uu2MtQvr";

type Props = {
  className?: string;
};

export function ProfileSettings({ className }: Props) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!session?.user) {
    return (
      <Link
        href={{
          pathname: "/sign-in",
          //query: router.pathname !== "/" ? { redirect: router.pathname } : undefined,
          query: { redirect: router.pathname },
        }}
        className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
      >
        Sign in
      </Link>
    );
  }

  return (
    <>
      <button
        className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {session.user.name}
      </button>
      <div className={`p-4 absolute top-12 right-0 bg-neutral-100 shadow-xl ${isOpen ? "visible" : "invisible"}`}>
        <h3>Profile</h3>
        <button className="p-2 bg-slate-100 m-2" onClick={() => {}}>
          Create bot
        </button>

        <Link
          href={DISCORD_INVITE_LINK}
          className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
        >
          Join the discord
        </Link>

        <div>
          <button className="p-2 bg-slate-100 m-2" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
