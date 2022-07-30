import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

type Props = {
  className?: string;
};

export function ProfileSettings({ className }: Props) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) {
    return (
      <button
        className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    );
  }

  return (
    <>
      <button
        className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Username
      </button>
      <div className={`p-4 absolute top-12 right-0 bg-neutral-100 shadow-xl ${isOpen ? "visible" : "invisible"}`}>
        <h3>Profile</h3>
        <button className="p-2 bg-slate-100 m-2" onClick={() => {}}>
          Create bot
        </button>

        <div>
          <button className="p-2 bg-slate-100 m-2" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
