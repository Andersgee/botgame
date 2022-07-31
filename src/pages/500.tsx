import type { NextPage } from "next";
import Link from "next/link";

const Page: NextPage = () => {
  return (
    <>
      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1>500 - Error</h1>
        <p>Maybe you need to sign in first?</p>
        <Link className="p-2 mt-4 underline text-3xl" href="/sign-in">
          Sign in
        </Link>
      </main>
    </>
  );
};

export default Page;
