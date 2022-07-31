import Link from "next/link";
import { ProfileSettings } from "./ProfileSettings";
import { ThemeToggleButton } from "./ThemeToggleButton";

type Props = {
  className?: string;
};
export function Nav({ className }: Props) {
  return (
    <div className={`flex justify-between bg-white dark:bg-black ${className}`}>
      <Link
        href="/"
        className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
      >
        Home
      </Link>
      <div>
        <Link
          href="/documentation"
          className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
        >
          Documentation
        </Link>

        <ThemeToggleButton />
        <ProfileSettings />
      </div>
    </div>
  );
}
