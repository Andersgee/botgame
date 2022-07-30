import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Head } from "src/components/Head";
import { prisma } from "src/server/db/client";
import { Nav } from "src/components/Nav";
import { hashidFromNumber, numberFromHashidparam } from "src/utils/hashids";
import { FallbackPage } from "src/components/FallbackPage";
import { ReplayTable } from "src/components/ReplayTable";
import { inferAsyncReturnType } from "@trpc/server";

async function findbot(id: number) {
  return prisma.bot.findUnique({
    where: { id },
    include: {
      user: true,
      replays: {
        include: {
          replay: {
            include: {
              bots: {
                include: {
                  bot: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

type Props = {
  bot: NonNullable<inferAsyncReturnType<typeof findbot>>;
};

const Page: NextPage<Props> = ({ bot }) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <FallbackPage />;
  }

  //get replays on each visit instead?
  //const { data: replays } = trpc.useQuery(["replay.get-by-profileId", { profileId: profile.id }]);

  const replays = bot.replays.map((r) => r.replay);
  return (
    <>
      <Head
        title={`${bot.name} | User | Botgame`}
        description={`Profile page and replays`}
        domainUrl="https://botgame.andyfx.net"
        url={`https://botgame.andyfx.net/bot/${hashidFromNumber(bot.id)}`}
      />
      <Nav />
      <main className="flex justify-center min-h-screen">
        <div>
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">{bot.name}</h1>
          <p>stats and replays of bot here</p>
          <p>creator: {bot.user.name}</p>

          <h2 className="text-4xl md:text-[4rem] leading-normal font-extrabold text-gray-700">Replays</h2>
          <ReplayTable replays={replays} />
        </div>
      </main>
    </>
  );
};

export default Page;

///////////////////////////////////////

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = numberFromHashidparam(params?.id);
    if (id == undefined) return { notFound: true };

    const bot = await findbot(id);
    if (!bot) return { notFound: true };

    const props: Props = { bot };
    return {
      props,
      revalidate: 10, //at most once every 10 seconds
    };
  } catch (error) {
    return { notFound: true };
  }
};
