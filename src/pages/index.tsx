import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { ThemeToggleButton } from "../components/ThemeToggleButton";
import { SigninButton } from "src/components/SigninButton";
import { ReplayTable } from "src/components/ReplayTable";
import { ProfileTable } from "src/components/ProfileTable";
import { Head } from "src/components/Head";
import { Nav } from "src/components/Nav";
import { UserTable } from "src/components/UserTable";

const btn = "bg-slate-600 p-2 text-white dark:bg-gray-200 dark:text-black m-2";

const Home: NextPage = () => {
  const { data: replays } = trpc.useQuery(["replay.get-all"], { refetchOnWindowFocus: false });

  const { data: profiles } = trpc.useQuery(["profile.get-all"], { refetchOnWindowFocus: false });

  const { data: users } = trpc.useQuery(["user.get-all"], { refetchOnWindowFocus: false });

  return (
    <>
      <Head
        title="Botgame"
        description="code your bot to beat other bots"
        domainUrl="https://botgame.andyfx.net"
        url="https://botgame.andyfx.net"
      />
      <Nav />
      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          C<span className="text-red-700">T3</span>A
        </h1>
        <p>just testing it out</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore dolore deserunt rerum in praesentium saepe
          ipsa perferendis, vel quam dignissimos reiciendis amet maxime fuga, repudiandae voluptate porro accusamus
          laboriosam quibusdam! Soluta reprehenderit ratione ut dicta voluptatem facilis eveniet omnis molestiae,
          sapiente distinctio sit laudantium velit iste corporis, temporibus fugiat vero.
        </p>

        <h3>replays</h3>
        {replays && <ReplayTable replays={replays} />}
        <h3>bots</h3>
        {profiles && <ProfileTable profiles={profiles} />}

        <h3>users</h3>
        {users && <UserTable users={users} />}
      </main>
    </>
  );
};

export default Home;
