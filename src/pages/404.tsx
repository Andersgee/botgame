import type { NextPage } from "next";
import Link from "next/link";

const Page: NextPage = () => {
  return (
    <>
      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1>404</h1>
        <p>This page could not be found.</p>
        <Link className="p-2 mt-4 underline text-3xl" href="/">
          Go to home page
        </Link>
      </main>
    </>
  );
};

export default Page;
