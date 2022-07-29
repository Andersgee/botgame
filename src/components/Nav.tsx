import Link from "next/link";
import { ThemeToggleButton } from "./ThemeToggleButton";

type Props = {
  className?: string;
};
export function Nav({ className }: Props) {
  return (
    <div className={`flex justify-between bg-neutral-300 dark:bg-neutral-700 ${className}`}>
      <Link
        href="/"
        className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
      >
        Home
      </Link>
      <ThemeToggleButton />
    </div>
  );
}
