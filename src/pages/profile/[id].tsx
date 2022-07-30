import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Head } from "src/components/Head";
import { prisma } from "src/server/db/client";
import { Nav } from "src/components/Nav";
import { hashidFromNumber, numberFromHashidparam } from "src/utils/hashids";
import { FallbackPage } from "src/components/FallbackPage";
import { inferAsyncReturnType } from "@trpc/server";
import { Bot } from "@prisma/client";
import { IdLink } from "src/components/IdLink";

async function finduser(intId: number) {
  return prisma.user.findUnique({
    where: { intId },
    include: {
      bots: {
        include: {
          botStats: true,
          user: true,
        },
      },
    },
  });
}

type User = NonNullable<inferAsyncReturnType<typeof finduser>>;

type Props = {
  user: User;
};

const Page: NextPage<Props> = ({ user }) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <FallbackPage />;
  }

  return (
    <>
      <Head
        title={`${user.name} | Profile | Botgame`}
        description={`Profile page and replays`}
        domainUrl="https://botgame.andyfx.net"
        url={`https://botgame.andyfx.net/profile/${hashidFromNumber(user.intId)}`}
      />
      <Nav />
      <main className="flex justify-center min-h-screen">
        <div>
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">{user.name}</h1>
          <p>bots and botstats for {user.name}</p>

          <h2 className="text-4xl md:text-[4rem] leading-normal font-extrabold text-gray-700">Bots</h2>
          <BotTable bots={user.bots} />
        </div>
      </main>
    </>
  );
};

export default Page;

function BotTable({ bots }: { bots: User["bots"] }) {
  return (
    <table className="bg-neutral-100 dark:bg-neutral-800 border-separate border-spacing-3">
      <thead>
        <tr className="border-b-2 border-neutral-600 dark:border-neutral-400">
          <th>name</th>
          <th>wins</th>
          <th>draws</th>
          <th>losses</th>
        </tr>
      </thead>
      <tbody>
        {bots.map((bot) => {
          return (
            <tr key={bot.id} className="border-b-2 border-neutral-500 dark:border-neutral-500">
              <td>
                <IdLink href="/bot/" id={bot.id}>
                  <div className="hover:opacity-60">{bot.name}</div>
                </IdLink>
              </td>
              <td>{bot.botStats?.wins}</td>
              <td>{bot.botStats?.draws}</td>
              <td>{bot.botStats?.losses}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

///////////////////////////////////////

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = numberFromHashidparam(params?.id);
    if (id == undefined) return { notFound: true };

    const user = await finduser(id);
    if (!user) return { notFound: true };

    const props: Props = { user };
    return {
      props,
      revalidate: 10, //at most once every 10 seconds
    };
  } catch (error) {
    return { notFound: true };
  }
};
