import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { ReplayTable } from "src/components/ReplayTable";
import { ProfileTable } from "src/components/ProfileTable";
import { Head } from "src/components/Head";
import { Nav } from "src/components/Nav";
import { UserTable } from "src/components/UserTable";

const btn = "bg-slate-600 p-2 text-white dark:bg-gray-200 dark:text-black m-2";

const Page: NextPage = () => {
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
        <h3>users</h3>
        {users && <UserTable users={users} />}
        <h3>bots</h3>
        {profiles && <ProfileTable profiles={profiles} />}
        <h3>replays</h3>
        {replays && <ReplayTable replays={replays} />}
      </main>
    </>
  );
};

export default Page;
