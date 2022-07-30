import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { inferQueryOutput, trpc } from "../utils/trpc";
import { ReplayTable } from "src/components/ReplayTable";
import { BotTable } from "src/components/BotTable";
import { Head } from "src/components/Head";
import { Nav } from "src/components/Nav";
import { UserTable } from "src/components/UserTable";
import { prisma } from "src/server/db/client";

type Bots = NonNullable<inferQueryOutput<"bot.get-all">>;
type Replays = NonNullable<inferQueryOutput<"replay.get-all">>;
type Users = NonNullable<inferQueryOutput<"user.get-all">>;

const btn = "bg-slate-600 p-2 text-white dark:bg-gray-200 dark:text-black m-2";

type Props = {
  bots: Bots;
  replays: Replays;
  users: Users;
};

const Home: NextPage<Props> = ({ bots, replays, users }) => {
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

        <h3>users</h3>
        <UserTable users={users} />
        <h3>bots</h3>
        <BotTable bots={bots} />
        <h3>replays</h3>
        <ReplayTable replays={replays} />
      </main>
    </>
  );
};

export default Home;

///////////////////////////////////////

export const getStaticProps: GetStaticProps = async () => {
  try {
    const bots = await prisma.bot.findMany({
      include: {
        user: true,
      },
    });
    const replays = await prisma.replay.findMany({
      include: {
        bots: {
          include: {
            bot: true,
          },
        },
      },
    });

    const users = await prisma.user.findMany();

    const props: Props = { bots, replays, users };
    return {
      props,
      revalidate: 10, //at most once every 10 seconds
    };
  } catch (error) {
    return { notFound: true };
  }
};
