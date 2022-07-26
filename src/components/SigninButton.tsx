import { useSession, signIn, signOut } from "next-auth/react";

type Props = {
  className?: string;
};

export function SigninButton(props: Props) {
  const { data: session } = useSession();

  return (
    <button className={props.className} onClick={() => (session ? signOut() : signIn())}>
      {session ? "sign out" : "sign in"}
    </button>
  );
}
