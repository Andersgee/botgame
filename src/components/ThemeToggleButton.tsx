import { useTheme } from "next-themes";

type Props = {
  className?: string;
};

export function ThemeToggleButton({ className }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
    >
      Theme
    </button>
  );
}
