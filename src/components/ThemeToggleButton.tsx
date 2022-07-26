import React from "react";
import { useTheme } from "next-themes";

export function ThemeToggleButton(props: { className?: string; children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  //console.log("theme:", theme);
  return (
    <button onClick={toggleTheme} className={` ${props.className}`} aria-label="Toggle theme">
      {props.children}
    </button>
  );
}
