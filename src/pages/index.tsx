import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { ThemeToggleButton } from "../components/ThemeToggleButton";
import { SigninButton } from "src/components/SigninButton";

const btn = "bg-slate-600 p-2 text-white dark:bg-gray-200 dark:text-black m-2";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }], { refetchOnWindowFocus: false });

  const { data: singleReplay } = trpc.useQuery(["replay.replayId", { id: "cl62chuzx004754uij78qx33o" }], {
    refetchOnWindowFocus: false,
  });

  const { data: singleNotexistingReplay } = trpc.useQuery(["replay.replayId", { id: "kek" }], {
    refetchOnWindowFocus: false,
  });

  const { data: replays } = trpc.useQuery(["replay.getAll"], { refetchOnWindowFocus: false });
  console.table(singleReplay);

  return (
    <>
      <Head>
        <title>Botgame</title>
        <meta name="description" content="Botgame" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          C<span className="text-red-700">T3</span>A
        </h1>
        <p>just testing it out</p>
        <ThemeToggleButton className={btn}>toggle theme</ThemeToggleButton>
        <SigninButton className={btn} />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore dolore deserunt rerum in praesentium saepe
          ipsa perferendis, vel quam dignissimos reiciendis amet maxime fuga, repudiandae voluptate porro accusamus
          laboriosam quibusdam! Soluta reprehenderit ratione ut dicta voluptatem facilis eveniet omnis molestiae,
          sapiente distinctio sit laudantium velit iste corporis, temporibus fugiat vero.
        </p>

        <h2>{hello.data ? hello.data.greeting : "Loading..."}</h2>

        <h3>replays</h3>
        <p className="break-words">{JSON.stringify(replays)}</p>
        <h3>singleReplay</h3>
        <p className="break-words">{JSON.stringify(singleReplay)}</p>
        <h3>singleNotexistingReplay</h3>
        <p className="break-words">{JSON.stringify(singleNotexistingReplay)}</p>
      </main>
    </>
  );
};

export default Home;
